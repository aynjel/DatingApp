import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@component/toast/toast';
import { Nav } from './layouts/nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, ToastComponent],
  template: `
    <app-nav />
    <div class="mt-24 container mx-auto">
      <router-outlet />
    </div>
    <app-toast />
  `,
})
export class App {}
