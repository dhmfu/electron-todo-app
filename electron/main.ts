import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

let win: BrowserWindow;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/todo-app-electron/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  );

  if (process.argv.some(arg => arg === '--serve')) {
    win.webContents.openDevTools();
  }


  win.on('closed', () => {
    win = null;
  });
}

ipcMain.on('getDB', (event, arg) => {
  fs.readFile(__dirname + '/db.json', (e, d) => {
    win.webContents.send('getDBResponse', JSON.parse(d.toString()));
  });
});

ipcMain.on('saveDB', (event, arg) => {
  fs.writeFileSync(__dirname + '/db.json', JSON.stringify(arg));
  win.webContents.send('saveDBResponse', 'Sucess');
});
