import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

import * as db from './db';
import { Todo } from '../shared/todo';

export const serveMode = process.argv.some(arg => arg === '--serve');

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

  db.init().then(() => {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/../../dist/todo-app-electron/index.html`),
        protocol: 'file:',
        slashes: true,
      })
    );

    if (serveMode) {
      win.webContents.openDevTools();
    }

    win.on('closed', () => {
      db.closeDb().then(() => {
        win = null;
      });
    });
  });
}

ipcMain.on('getDB', (event, arg) => {
  db.getAllTodos().then((todos) => {
    win.webContents.send('getDBResponse', todos);
  });
});

ipcMain.on('addTodo', (e, arg: string) => {
  db.addTodo(arg).then(() => {
    win.webContents.send('addTodoResponse');
  });
});

ipcMain.on('deleteTodo', (e, arg: Todo) => {
  db.deleteTodo(arg.value).then(() => {
    win.webContents.send('deleteTodoResponse');
  });
});
