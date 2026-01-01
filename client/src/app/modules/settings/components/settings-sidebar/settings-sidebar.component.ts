import { Component, computed, input } from '@angular/core';
import {
  BellIcon,
  EyeIcon,
  LucideAngularModule,
  ShieldIcon,
  UserIcon,
} from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Member } from '../../../../shared/models/member.model';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-settings-sidebar',
  imports: [LucideAngularModule, AvatarComponent],
  templateUrl: './settings-sidebar.component.html',
})
export class SettingsSidebarComponent {
  readonly userIcon = UserIcon;
  readonly bellIcon = BellIcon;
  readonly eyeIcon = EyeIcon;
  readonly shieldIcon = ShieldIcon;

  currentUser = input<User | undefined>();
  memberDetails = input<Member | undefined>();

  displayName = computed(() => {
    return (
      this.memberDetails()?.displayName ||
      this.currentUser()?.displayName ||
      'User'
    );
  });
}
