import { Component } from '@angular/core';
import { ElectronService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isElectron = false;
  isSaving = false;

  todos: string[] = [];

  constructor(private electronService: ElectronService) {
    this.isElectron = electronService.isElectron;

    if (this.isElectron) {
      this.electronService.getDB().then((db) => {
        this.todos = db;
      });
    }
  }

  async add(input: HTMLInputElement) {
    if (this.isSaving) {
      return;
    }

    const value = input.value;

    if (!value) {
      return;
    }

    input.value = '';
    input.focus();

    const todos = [...this.todos, value];

    this.isSaving = true;

    await this.save(todos);

    this.isSaving = false;

    this.todos = todos;
  }

  async delete(todo: string) {
    if (this.isSaving) {
      return;
    }

    const todos = this.todos.filter(t => t !== todo);

    this.isSaving = true;

    await this.save(todos);

    this.isSaving = false;

    this.todos = todos;
  }

  preventForm($event: Event) {
    $event.preventDefault();

    if (this.isSaving) {
      return;
    }
  }

  async save(todos: string[]): Promise<void> {
    if (this.isElectron) {
      await this.electronService.saveDB(todos);
    }
  }

}
