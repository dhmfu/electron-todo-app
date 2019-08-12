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

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

ipcMain.on('getDB', (event, arg) => {
  // fs.writeFileSync(__dirname + '/db.json', JSON.stringify({ a: 'b' }));
  fs.readFile(__dirname + '/db.json', (e, d) => {
    let a = '0';

    try {
      a = JSON.parse(d.toString());
    } catch (error) {}
    win.webContents.send('getDBResponse', e || a);
  });
  // const files = fs.readdirSync(__dirname);
  // win.webContents.send('getFilesResponse', __dirname + '/db.json');
});

ipcMain.on('saveDB', (event, arg) => {
  fs.writeFileSync(__dirname + '/db.json', JSON.stringify(arg));
  win.webContents.send('saveDBResponse', 'Sucess');
});
