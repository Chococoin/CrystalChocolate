const electron = require('electron');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const url = require('url');
const path = require('path');
const mongoose = require('mongoose');
const apiRequests = require('superagent');
const User = require('../models/Users');
const db = require('../config/mongodb_access').mongoURI; // DB Config
const key = require('../config/mongodb_access').secretOrKey;
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const githubKey = require('../keys/strategy-keys');
const random_status = require('../helpers/random_status');
const handleCallback = require('../helpers/handleCallback');

const { app, BrowserWindow, Menu, ipcMain } = electron;

mongoose.connect(db, { useNewUrlParser: true })
  .then(()=> console.log('Mongo_DB connected'))
  .catch(err => console.log(err));

let mainWindow;
let loginWindow;
let registerWindow;
let cookie = '';

const startUrl = process.env.ELECTRON_START_URL || url.format({
                 pathname: path.join(__dirname, '/../build/index.html'),
                 protocol: 'file:',
                 slashes: true
                });

app.on('ready', ()=>{
  mainWindow = new BrowserWindow({ width: 1200, height: 850 });
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function(){
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Open loginWindow from mainWindow
ipcMain.on('signInMain:open', (e)=> {
  loginWindow = new BrowserWindow({ width: 600, height: 400 });
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/loginWindow.ejs'),
    protocol: 'file',
    slashes: true
  }));
});

// Open loginWindow from registerWindow
ipcMain.on('signIn:open', (e)=> {
  loginWindow = new BrowserWindow({ width: 600, height: 400 });
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/loginWindow.ejs'),
    protocol: 'file',
    slashes: true
  }));
  registerWindow.close();
});

// Catch user:add from loginWindow
ipcMain.on('user:add', (e, data)=> {
  User.findOne({user: data.user})
    .then(res => {
      bcrypt.compare(data.pass, res.password)
        .then((isMatch)=>{
          if(isMatch){
            const payload = { id: data._id, name: data.user, date: data.date };
            jwt.sign(
              payload,
              key,
              { expiresIn: 3600 },
              (err, token) => {
                console.log('Success: You have got access');
                console.log('token: ', 'Bearer ' + token);
              });
          } else {
            console.log('Fail: Wrong Password');
          }
      });
    })
    .catch(err => { if(err) throw err });
  const { errors, isValid } = validateLoginInput(data);
  if(!isValid){
    console.log(errors);
  } else {
    loginWindow.close();
  }
});

// Create and Open registerWindow from loginWindow
ipcMain.on('signUpMain:open', (e)=> {
  registerWindow = new BrowserWindow({ width: 600, height: 500 });
  registerWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/registerWindow.ejs'),
    protocol: 'file',
    slashes: true
  }));
});

// Create and Open registerWindow from loginWindow
ipcMain.on('signUp:open', (e)=> {
  registerWindow = new BrowserWindow({ width: 600, height: 500 });
  registerWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/registerWindow.ejs'),
    protocol: 'file',
    slashes: true
  }));
  loginWindow.close();
});

// Catch user:add from registerWindow
ipcMain.on('register:add', (e, data)=> {
  const { errors, isValid } = validateRegisterInput(data);
  // Check Validation
  if(!isValid){
    console.log(errors);
  }
  if(isValid){
    User.findOne({email: data.email})
    .then(res=>{
      if(res !== null){
        if (data.email == res.email){
          console.log('email already exists.');
        } else {
          console.log('This should not have happened!');
        }
      }
      if(res === null){
        // Add Salt
        // ToDo: USE AN USER PIN VALUE AS ARG FOR GEN SALT.
        bcrypt.genSalt(1, (err, salt) => {
          bcrypt.hash(data.pass, salt, (err, hash) => {
            if(err) throw err;
            data.pass = hash;
            console.log('Salted pass', data.pass);
            var newUser = new User({
              user: data.user,
              first_name: data.firstName,
              last_name: data.lastName,
              country: data.country,
              email: data.email,
              password: data.pass
            });
            newUser.save().then((res)=>{console.log('Resp: ', res)});
          })
        });
      }
    })
    .catch(err=> console.log(err));
  }

  registerWindow.close();
});

// github OAuthentication
ipcMain.on('OAuthGithub:open', (e) => {
  oauthWindow = new BrowserWindow({ width: 450, height: 620 });
  const githubUrl = 'https://github.com/login/oauth/authorize?';
  var req_status = random_status();
  var authUrl = githubUrl + 'client_id=' + githubKey.clientId + '&scope=' +
                githubKey.scopes + '&status=' + req_status; 
  oauthWindow.loadURL(authUrl);
  oauthWindow.show();

  // Handle the response from GitHub - See Update from 4/12/2015
  oauthWindow.webContents.on('will-navigate', (event, url) => {
    handleCallback(url, req_status).then((c) => {
      cookie += c;
      console.log('Your Token for github is: ', cookie);
    }).catch(err => {
      console.log(err);
    });
  });

  oauthWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    handleCallback(newUrl, req_status);
  });

  // Reset the authWindow on close
  oauthWindow.on('close', () => {
      oauthWindow = null;
  }, false);
});

  // Wait for the user's github login
var cookieListener = setInterval(()=>{
  if (cookie !== ''){
    mainWindow.webContents.send('cookie', cookie);
    clearInterval(cookieListener);
    cookie = null;
  }
}, 3000);

app.setName('CrystalChocolate');

const mainMenuTemplate = [
  {
    label: app.getName(),
    submenu: [
      {
        label: 'About',
        accelerator: process.platform == 'darwin' ? 'Command+A' :
        'Ctrl+A',
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' :
        'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
];

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
