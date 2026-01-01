import { Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../../../../shared/store/auth.store';
import { AccountSettingsComponent } from '../../components/account-settings/account-settings.component';
import { DangerZoneComponent } from '../../components/danger-zone/danger-zone.component';
import { NotificationsSettingsComponent } from '../../components/notifications-settings/notifications-settings.component';
import { PrivacySettingsComponent } from '../../components/privacy-settings/privacy-settings.component';
import { SecuritySettingsComponent } from '../../components/security-settings/security-settings.component';
import { SettingsSidebarComponent } from '../../components/settings-sidebar/settings-sidebar.component';

@Component({
  selector: 'app-settings',
  imports: [
    SettingsSidebarComponent,
    AccountSettingsComponent,
    NotificationsSettingsComponent,
    PrivacySettingsComponent,
    SecuritySettingsComponent,
    DangerZoneComponent,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private authStore = inject(AuthStore);

  currentUser = computed(() => this.authStore.currentUser());
  memberDetails = computed(() => this.authStore.memberDetails());

  // Settings state
  emailNotifications = signal(false);
  pushNotifications = signal(false);
  profileVisibility = signal('public');
  showOnlineStatus = signal(true);
  allowMessagesFrom = signal('everyone');

  onLogout(): void {
    this.authStore.logout();
  }

  onSaveSettings(): void {
    // TODO: Implement save settings logic
    console.log('Settings saved:', {
      emailNotifications: this.emailNotifications(),
      pushNotifications: this.pushNotifications(),
      profileVisibility: this.profileVisibility(),
      showOnlineStatus: this.showOnlineStatus(),
      allowMessagesFrom: this.allowMessagesFrom(),
    });
  }

  onEmailNotificationsChange(value: boolean): void {
    this.emailNotifications.set(value);
  }

  onPushNotificationsChange(value: boolean): void {
    this.pushNotifications.set(value);
  }

  onProfileVisibilityChange(value: string): void {
    this.profileVisibility.set(value);
  }

  onShowOnlineStatusChange(value: boolean): void {
    this.showOnlineStatus.set(value);
  }

  onAllowMessagesFromChange(value: string): void {
    this.allowMessagesFrom.set(value);
  }
}
