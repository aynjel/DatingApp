import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Users } from '@service/users';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit {
  private userService = inject(Users);

  protected users: WritableSignal<User[]> = signal([]);

  private unSubscribe$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (users) => this.users.set(users),
        error: (err) => console.error('Error fetching users:', err),
        complete: () => console.log('Completed'),
      });
  }
}
