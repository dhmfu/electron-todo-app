import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

declare var window: Window;
interface Window {
  process: any;
  require: any;
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;

  get isElectron() {
    return window && window.process && window.process.type && window.require;
  }

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
    }
  }

  async getDB() {
    return new Promise<any[]>((resolve, reject) => {
      this.ipcRenderer.once('getDBResponse', (event, arg) => {
        console.log(arg);
        resolve(arg);
      });

      this.ipcRenderer.send('getDB');
    });
  }

  async saveDB(todos: string[]) {
    return new Promise<any[]>((resolve, reject) => {
      this.ipcRenderer.once('saveDBResponse', (event, arg) => {
        resolve(arg);
      });

      this.ipcRenderer.send('saveDB', todos);
    });
  }
}
