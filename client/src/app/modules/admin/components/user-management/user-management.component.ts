import { Component, inject, OnInit, signal } from '@angular/core';
import { UserRoles } from '../../../../shared/models/user.model';
import { ModalService } from '../../../../shared/services/modal.service';
import { UserWithRoles } from '../../models/common.model';
import { AdminService } from '../../services/admin.service';
import { EditRolesModalComponent } from '../edit-roles-modal/edit-roles-modal.component';
import { AvailableUserRoles } from './../../../../shared/constants/common.const';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(ModalService);

  protected users = signal<UserWithRoles[]>([]);
  protected selectedUser = signal<UserWithRoles | null>(null);

  protected readonly availableUserRoles: UserRoles[] =
    Object.values(AvailableUserRoles);

  ngOnInit(): void {
    this.loadUsers();
  }

  openRoleModal(user: UserWithRoles): void {
    this.selectedUser.set(user);
    this.modalService.open(
      EditRolesModalComponent,
      {
        user: this.selectedUser(),
      },
      (user: UserWithRoles | null) => {
        this.selectedUser.set(null);
        this.loadUsers();
        console.log('Roles modal closed', user);
      },
    );
  }

  private loadUsers(): void {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) => this.users.set(users),
      error: (err) => {
        console.error('Failed to load users with roles', err);
      },
    });
  }
}
