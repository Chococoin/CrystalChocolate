const electron = require('electron');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const url = require('url');
const path = require('path');
const mongoose = require('mongoose');
const apiRequests = require('superagent');
const User = require('./models/Users');
const db = require('./config/mongodb_access').mongoURI; // DB Config
const key = require('./config/mongodb_access').secretOrKey;
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');
const githubKey = require('./keys/strategy-keys');

process.env.NODE_ENV = 'development';

const { app, BrowserWindow, Menu, ipcMain } = electron;

mongoose.connect(db, { useNewUrlParser: true })
  .then(()=> console.log('Mongo_DB connected'))
  .catch(err => console.log(err));

let mainWindow;
let loginWindow;
let registerWindow;

// Create mainWindow
app.on('ready', ()=>{
  mainWindow = new BrowserWindow({ width: 1200, height: 850 });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.ejs'),
    protocol: 'file:',
    slashes: true
  }));

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
    pathname: path.join(__dirname, 'loginWindow.ejs'),
    protocol: 'file',
    slashes: true
  }));
});

// Open loginWindow from registerWindow
ipcMain.on('signIn:open', (e)=> {
  loginWindow = new BrowserWindow({ width: 600, height: 400 });
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loginWindow.ejs'),
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
    pathname: path.join(__dirname, 'registerWindow.ejs'),
    protocol: 'file',
    slashes: true
  }));
});

// Create and Open registerWindow from loginWindow
ipcMain.on('signUp:open', (e)=> {
  registerWindow = new BrowserWindow({ width: 600, height: 500 });
  registerWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'registerWindow.ejs'),
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
  var authUrl = githubUrl + 'client_id=' + githubKey.clientId + '&scope=' +
                githubKey.scopes + '&status=mustBeRandom'; // TODO: Deploy a random status to avoid men in the middle attack
  oauthWindow.loadURL(authUrl);
  oauthWindow.show();

  function handleCallback (url) {
    var raw_code = /code=([^&]*)/.exec(url) || null;
    var raw_status_res = /status=([a-zA-Z]*)/.exec(url) || null;
    var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    var status_res = ( raw_status_res && raw_status_res.length > 1) ? raw_status_res[1] : null;
    var error = /\?error=(.+)$/.exec(url);

    // if (status_res !== 'mustBeRandom'){ --> TODO!
    //   //oauthWindow.destroy();
    //   console.log(status_res, 'mustBeRandom');
    // }

    if (code || error) {
      // Close the browser if code found or error
      oauthWindow.destroy();
    }

    // If there is a code, proceed to get token from github
    if (code) {
      apiRequests
      .post('https://github.com/login/oauth/access_token', {
        client_id: githubKey.clientId,
        client_secret: githubKey.clientSecret,
        code: code,
        status: 'mustBeRandom'
      })
      .end(function (err, response) {
        if (response && response.ok) {
          // Success - Received Token.
          // Store it in localStorage maybe?
          apiRequests.get('https://api.github.com/user', {
            access_token: response.body.access_token,
          }).end((err, res) => {
            User.findOne({ email: res.body.email }).then( resp => {
              if(resp === null){
                var newUser = new User({
                  user: res.body.login,
                  email: res.body.email,
                  avatar: res.body.avatar
                });
                newUser.save();
              } else {
                console.log('Welcome: ', resp.user);
              }
            })
          })
        } else {
          // Error - Show messages.
          console.log(err);
        }
      });

    } else if (error) {
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
    }
  }

  // Handle the response from GitHub - See Update from 4/12/2015

  oauthWindow.webContents.on('will-navigate', (event, url) => {
    console.log('1');
    handleCallback(url);
  });

  oauthWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    console.log('2');
    handleCallback(newUrl);
  });

  // Reset the authWindow on close
  oauthWindow.on('close', () => {
      oauthWindow = null;
  }, false);
});

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
