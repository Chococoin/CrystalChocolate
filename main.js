const electron = require('electron');
const url = require('url');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/mongodb_access').mongoURI; // DB Config

process.env.NODE_ENV = 'development';

const { app, BrowserWindow, Menu, ipcMain } = electron;

mongoose.connect(db, { useNewUrlParser: true })
  .then(()=> console.log('Mongo_DB connected'))
  .catch(err => console.log(err));

let mainWindow;
let loginWindow;

app.on('ready', ()=>{
  mainWindow = new BrowserWindow({});
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

app.on('ready', ()=>{
  loginWindow = new BrowserWindow({ width: 600, height: 400 });
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loginWindow.html'),
    protocol: 'file',
    slashes: true
  }));
});

// Catch user:add from loginWindow
ipcMain.on('user:add', (e, data)=> {
  console.log(data.user, data.pass); // Test submitLogin function.
  loginWindow.close();
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
