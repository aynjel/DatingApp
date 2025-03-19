import { Component } from '@angular/core';
import { Sandbox } from './store/sandbox/sandbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'DatingApp';

  constructor(public readonly sandbox: Sandbox) {}
}
