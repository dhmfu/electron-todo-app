import { Component } from '@angular/core';
import { ElectronService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isElectron = false;

  todos: string[] = [];

  constructor(private electronService: ElectronService) {
    this.isElectron = electronService.isElectron;

    if (this.isElectron) {
      this.electronService.getDB().then((db) => {
        this.todos = this.todos.concat(db);
      });
    }
  }

  add(input: HTMLInputElement) {
    const value = input.value;

    input.value = '';
    input.focus();

    this.todos.push(value);
  }

  delete(todo: string) {
    this.todos = this.todos.filter(t => t !== todo);
  }

  preventForm($event: Event) {
    $event.preventDefault();
  }

  save() {
    if (this.isElectron) {
      this.electronService.saveDB(this.todos).then((r) => {
        alert(r);
      });
    }
  }

}
