import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './layouts/nav/nav';
import { ToastComponent } from './shared/components/toast/toast';
import { Auth } from './shared/services/auth';

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
export class App implements OnInit {
  private readonly authService = inject(Auth);

  ngOnInit(): void {
    this.authService.retrieveUserAccount();
    console.log(this.authService.isLoggedIn());
  }
}
