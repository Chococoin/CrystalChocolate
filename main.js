const electron = require('electron');
const url = require('url');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/Users')
const db = require('./config/mongodb_access').mongoURI; // DB Config
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');

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
  mainWindow = new BrowserWindow({ width: 850, height: 650 });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function(){
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Create loginWindow
app.on('ready', ()=>{
  loginWindow = new BrowserWindow({ width: 600, height: 400 });
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loginWindow.html'),
    protocol: 'file',
    slashes: true
  }));
});

// Open loginWindow from registerWindow
ipcMain.on('signIn:open', (e)=> {
  loginWindow = new BrowserWindow({ width: 600, height: 400 });
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loginWindow.html'),
    protocol: 'file',
    slashes: true
  }));
  registerWindow.close();
});

// Catch user:add from loginWindow
ipcMain.on('user:add', (e, data)=> {
  console.log('User input: ', data.user, 'Pass input: ', data.pass); // Test submitLogin function.
  const { errors, isValid } = validateLoginInput(data);
  if(!isValid){
    console.log(errors);
  } else { 
    loginWindow.close();
  }
});

// Create and Open registerWindow from loginWindow
ipcMain.on('signUp:open', (e)=> {
  registerWindow = new BrowserWindow({ width: 600, height: 500 });
  registerWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'registerWindow.html'),
    protocol: 'file',
    slashes: true
  }));
  loginWindow.close();
});

// Catch user:add from registerWindow
ipcMain.on('register:add', (e, data)=> {
  const { errors, isValid } = validateRegisterInput(data);
  // Check Validation
  console.log(isValid);
  if(!isValid){
    console.log(errors);
  }
  if(isValid){
    User.findOne({email: data.email})
    .then(res=>{
      if (data.email == res.email){
        console.log('email already exists.');
      } else {
        var newUser = new User({ user: data.user,
                                 first_name: data.firstName,
                                 last_name: data.lastName,
                                 country: data.country,
                                 email: data.email,
                                 password: data.pass
                              });
        newUser.save().then((res)=>{console.log('Res: ', res)});
      }
    })
    .catch(err=> console.log(err));
  } 

  registerWindow.close();
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
