import { Injectable } from '@angular/core';

import { ipcRenderer } from 'electron';

import { Todo } from 'shared/todo';

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
    return new Promise<Todo[]>((resolve, reject) => {
      this.ipcRenderer.once('getDBResponse', (event, arg) => {
        resolve(arg);
      });

      this.ipcRenderer.send('getDB');
    });
  }

  async addTodo(todoValue: string) {
    return new Promise<void>((resolve, reject) => {
      this.ipcRenderer.once('addTodoResponse', (event, arg) => {
        resolve(arg);
      });

      this.ipcRenderer.send('addTodo', todoValue);
    });
  }

  async deleteTodo(todo: Todo) {
    return new Promise<void>((resolve, reject) => {
      this.ipcRenderer.once('deleteTodoResponse', (event, arg) => {
        resolve(arg);
      });

      this.ipcRenderer.send('deleteTodo', todo);
    });
  }
}
