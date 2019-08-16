import * as sqlite3 from 'sqlite3';
import * as path from 'path';

import { serveMode } from './main';

import { Todo } from '../shared/todo';

const dbPath = path.join(__dirname, '..', 'db', 'todos.db');

let db: sqlite3.Database;

export function init(): Promise<void> {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        db.serialize(() => {
          db.run('CREATE TABLE if not exists todos (value TEXT)', (error) => {
            if (error) {
              reject(error);
            } else {
              if (serveMode) {
                console.log('Opened db connection');
              }

              resolve();
            }
          });
        });
      }
    });
  });
}

export function closeDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        if (serveMode) {
          console.log('Closed db connection');
        }

        resolve();
      }
    });
  });
}

export function getAllTodos(): Promise<Todo[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * from todos', (err, res: Todo[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export function addTodo(todoValue: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('INSERT into todos VALUES (?)', [todoValue], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function deleteTodo(todoValue: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('DELETE from todos WHERE value=?', [todoValue], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
