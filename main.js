const electron = require('electron');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const url = require('url');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/Users');
const db = require('./config/mongodb_access').mongoURI; // DB Config
const key = require('./config/mongodb_access').secretOrKey;
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');

const {
  app, BrowserWindow, Menu, ipcMain
} = electron;

process.env.NODE_ENV = 'development';

let mainWindow;
let loginWindow;
let registerWindow;

app.setName('CrystalChocolate');
const mainMenuTemplate = [{
  label: app.getName(),
  submenu: [{
    label: 'About',
    accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
  }, {
    label: 'Quit',
    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click() {
      app.quit();
    }
  }]
}, ];

mongoose.connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log('Mongo_DB connected'))
  .catch(err => console.log(err));

class MainWindow {
  constructor() {
    function createMain() {
      // Create mainWindow
      app.on('ready', () => {
        mainWindow = new BrowserWindow({
          width: 1200,
          height: 850
        });
        mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, 'mainWindow.html'),
          protocol: 'file:',
          slashes: true
        }));
        mainWindow.on('closed', function() {
          app.quit();
        });

        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
      });
    }

    function createLogin() {
      // Create loginWindow
      app.on('ready', () => {
        loginWindow = new BrowserWindow({
          width: 600,
          height: 400
        });
        loginWindow.loadURL(url.format({
          pathname: path.join(__dirname, 'loginWindow.html'),
          protocol: 'file',
          slashes: true
        }));
      });
    }

  createMain();
  createLogin();

  }
}

var start = new MainWindow();

function openLoginFromRegister() {
  // Open loginWindow from registerWindow
  loginWindow = new BrowserWindow({
    width: 600,
    height: 400
  });
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loginWindow.html'),
    protocol: 'file',
    slashes: true
  }));
  registerWindow.close();
}

function loginChecker(data) {
  // Catch user:add from loginWindow
  User.findOne({
      user: data.user
    })
    .then(res => {
      bcrypt.compare(data.pass, res.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = {
              id: data._id,
              name: data.user,
              date: data.date
            };
            jwt.sign(
              payload,
              key, {
                expiresIn: 3600
              }, (err, token) => {
                console.log('Success: You have got access');
                console.log('token: ', 'Bearer ' + token)
              });
          } else {
            console.log('Fail: Wrong Password');
          }
        });
      })
    .catch(err => {
      if (err) throw err
    });
  const { errors, isValid } = validateLoginInput(data);
  if (!isValid) {
    console.log(errors);
  } else {
    loginWindow.close();
  }
}

function openRegisterfromLogin() {
  // Create and Open registerWindow from loginWindow
  registerWindow = new BrowserWindow({
    width: 600,
    height: 500
  });
  registerWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'registerWindow.html'),
    protocol: 'file',
    slashes: true
  }));
  loginWindow.close();
}

function registerChecker() {
  // Catch user:add from registerWindow
  const {
    errors, isValid
  } = validateRegisterInput(data);
  // Check Validation
  if (!isValid) {
    console.log(errors);
    }
    if (isValid) {
    User.findOne({
        email: data.email
    })
    .then(res => {
      if (res !== null) {
        if (data.email == res.email) {
          console.log('email already exists.');
        } else {
          console.log('This should not have happened!')
        }
      }
      if (res === null) {
      // Add Salt 
      // ToDo: USE AN USER PIN VALUE AS ARG FOR GEN SALT. 
      bcrypt.genSalt(1, (err, salt) => {
        bcrypt.hash(data.pass, salt, (err, hash) => {
          if (err) throw err;
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
        newUser.save().then((res) => {
          console.log('Resp: ', res)
        });
      })
    });
  }
})
.catch(err => console.log(err));
      }
      registerWindow.close();
    }

  if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu: [{
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }, {
        role: 'reload'
      }]
  });
}

// Open loginWindow from registerWindow
ipcMain.on('signIn:open', (e)=>{openLoginFromRegister()});

ipcMain.on('user:add', (e, data)=> {loginChecker(data)});

// Open registerWindowl from oginWindow
ipcMain.on('signUp:open', (e)=>{openRegisterfromLogin()});

// Catch user:add from registerWindow
ipcMain.on('register:add', (e, data)=>{registerChecker(data)});

module.exports = MainWindow;
