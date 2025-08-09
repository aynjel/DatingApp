import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Users } from './services/users';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
    <button class="btn btn-secondary">Secondary</button>
  `,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private userService = inject(Users);

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => console.log('Users fetched:', users),
      error: (err) => console.error('Error fetching users:', err),
      complete: () => console.log('Completed'),
    });
  }
}
