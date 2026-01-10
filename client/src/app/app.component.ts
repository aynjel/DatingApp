import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@component/toast/toast.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { NavComponent } from './shared/components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, ToastComponent, ModalComponent],
  template: `
    <app-nav />
    <div id="main-content" class="mt-[4rem] w-full transition-all duration-300">
      <router-outlet />
    </div>
    <app-toast />
    <app-modal />
  `,
})
export class AppComponent {}
