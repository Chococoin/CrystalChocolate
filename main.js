const electron = require('electron');
const url = require('url');
const path = require('path');

process.env.NODE_ENV = 'production';

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

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
        label: 'toggle DevTools',
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
