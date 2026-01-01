import { Component, input, output, signal } from '@angular/core';
import { LucideAngularModule, BellIcon } from 'lucide-angular';

@Component({
  selector: 'app-notifications-settings',
  imports: [LucideAngularModule],
  templateUrl: './notifications-settings.component.html',
})
export class NotificationsSettingsComponent {
  readonly bellIcon = BellIcon;

  emailNotifications = input.required<boolean>();
  pushNotifications = input.required<boolean>();

  emailNotificationsChange = output<boolean>();
  pushNotificationsChange = output<boolean>();

  onEmailNotificationsChange(checked: boolean): void {
    this.emailNotificationsChange.emit(checked);
  }

  onPushNotificationsChange(checked: boolean): void {
    this.pushNotificationsChange.emit(checked);
  }
}

