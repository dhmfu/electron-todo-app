import { Component } from '@angular/core';
import { ElectronService } from './services';

import { Todo } from 'shared/todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isElectron = false;
  isSaving = false;

  todos: Todo[] = [];

  constructor(private electronService: ElectronService) {
    this.isElectron = electronService.isElectron;

    if (this.isElectron) {
      this.electronService.getDB().then((db) => {
        this.todos = db;
      });
    }
  }

  async add(input: HTMLInputElement) { // outdated
    if (this.isSaving) {
      return;
    }

    const value = input.value;

    if (!value) {
      return;
    }

    input.value = '';
    input.focus();

    this.isSaving = true;

    await this.electronService.addTodo(value);

    this.isSaving = false;

    this.todos.push({ value }); // temp
  }

  async delete(todo: Todo) {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    await this.electronService.deleteTodo(todo);

    this.isSaving = false;

    this.todos = this.todos.filter(t => t !== todo);
  }

  preventForm($event: Event) {
    $event.preventDefault();

    if (this.isSaving) {
      return;
    }
  }

}
