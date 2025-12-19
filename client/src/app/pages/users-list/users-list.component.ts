import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  private userService = inject(UsersService);

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
