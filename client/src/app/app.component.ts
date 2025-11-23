import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@component/toast/toast';
import { NavComponent } from './layouts/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, ToastComponent],
  template: `
    <app-nav />
    <div class="mt-24 container mx-auto">
      <router-outlet />
    </div>
    <app-toast />
  `,
})
export class AppComponent {}
