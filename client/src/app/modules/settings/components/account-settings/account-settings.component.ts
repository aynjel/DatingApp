import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, UserIcon } from 'lucide-angular';
import { Member } from '../../../../shared/models/member.model';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-account-settings',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './account-settings.component.html',
})
export class AccountSettingsComponent {
  readonly userIcon = UserIcon;

  currentUser = input<User | undefined>();
  memberDetails = input<Member | undefined>();

  displayName = computed(() => {
    return (
      this.memberDetails()?.displayName || this.currentUser()?.displayName || ''
    );
  });
}
