import { Component } from '@angular/core';
import { KeyIcon, LucideAngularModule, ShieldIcon } from 'lucide-angular';

@Component({
  selector: 'app-security-settings',
  imports: [LucideAngularModule],
  templateUrl: './security-settings.component.html',
})
export class SecuritySettingsComponent {
  readonly shieldIcon = ShieldIcon;
  readonly keyIcon = KeyIcon;

  onChangePassword(): void {
    // TODO: Implement change password logic
    console.log('Change password clicked');
  }

  onEnable2FA(): void {
    // TODO: Implement 2FA logic
    console.log('Enable 2FA clicked');
  }
}
