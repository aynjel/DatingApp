import { Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../../../../shared/store/auth.store';
import { PhotoManagementComponent } from '../../components/photo-management/photo-management.component';
import { UserManagementComponent } from '../../components/user-management/user-management.component';

type AdminTab = 'roles' | 'photos';

@Component({
  selector: 'app-admin',
  imports: [UserManagementComponent, PhotoManagementComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  authStore = inject(AuthStore);

  hasAdminAccess = computed(() => this.authStore.hasAdminAccess()); // Placeholder for actual admin access logic
  activeTabs = signal<AdminTab>(this.hasAdminAccess() ? 'roles' : 'photos');

  readonly TABS: { label: string; value: AdminTab }[] = [
    { label: 'User Management', value: 'roles' },
    { label: 'Photo Management', value: 'photos' },
  ];

  setActiveTab(tab: AdminTab): void {
    this.activeTabs.set(tab);
  }
}
