import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@component/toast/toast.component';
import { NavComponent } from './shared/components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, ToastComponent],
  template: `
    <app-nav />
    <div class="mt-[4rem] w-full">
      <router-outlet />
    </div>
    <app-toast />
  `,
})
export class AppComponent {}
