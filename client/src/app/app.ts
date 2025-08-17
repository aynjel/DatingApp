import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './layouts/nav/nav';
import { Auth } from './shared/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  template: `
    <app-nav />
    <div class="card w-1/2 mx-auto p-10 mt-10">
      <router-outlet />
    </div>
  `,
})
export class App implements OnInit {
  private readonly authService = inject(Auth);

  ngOnInit(): void {
    this.authService.retrieveUserAccount();
    console.log(this.authService.isLoggedIn());
  }
}
