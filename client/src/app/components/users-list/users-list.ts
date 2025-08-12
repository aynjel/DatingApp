import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Users } from '@service/users';

@Component({
  selector: 'app-users-list',
  imports: [JsonPipe],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit {
  private userService = inject(Users);

  protected users: any[] = [];

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('users', users);

        this.users = users;
      },
      error: (err) => console.error('Error fetching users:', err),
      complete: () => console.log('Completed'),
    });
  }
}
