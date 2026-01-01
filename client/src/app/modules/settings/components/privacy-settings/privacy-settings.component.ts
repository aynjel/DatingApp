import { Component, input, output } from '@angular/core';
import { EyeIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-privacy-settings',
  imports: [LucideAngularModule],
  templateUrl: './privacy-settings.component.html',
})
export class PrivacySettingsComponent {
  readonly eyeIcon = EyeIcon;

  profileVisibility = input.required<string>();
  showOnlineStatus = input.required<boolean>();
  allowMessagesFrom = input.required<string>();

  profileVisibilityChange = output<string>();
  showOnlineStatusChange = output<boolean>();
  allowMessagesFromChange = output<string>();

  onProfileVisibilityChange(value: string): void {
    this.profileVisibilityChange.emit(value);
  }

  onShowOnlineStatusChange(checked: boolean): void {
    this.showOnlineStatusChange.emit(checked);
  }

  onAllowMessagesFromChange(value: string): void {
    this.allowMessagesFromChange.emit(value);
  }
}
