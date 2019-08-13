import { Injectable } from '@angular/core';

import { ipcRenderer } from 'electron';

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
    return new Promise<string[]>((resolve, reject) => {
      this.ipcRenderer.once('getDBResponse', (event, arg) => {
        resolve(arg);
      });

      this.ipcRenderer.send('getDB');
    });
  }

  async saveDB(todos: string[]) {
    return new Promise<void>((resolve, reject) => {
      this.ipcRenderer.once('saveDBResponse', (event, arg) => {
        resolve(arg);
      });

      this.ipcRenderer.send('saveDB', todos);
    });
  }
}
