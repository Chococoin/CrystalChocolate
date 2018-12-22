const electron = require('electron');
const {
  app, BrowserWindow, Menu, ipcMain
} = electron;

app.setName('CrystalChocolate');

class MainTest{
	constructor(){
		function getname(){
			return app.getName();
		}
	}
}

var name = new MainTest();

console.log(name);

module.exports = app;