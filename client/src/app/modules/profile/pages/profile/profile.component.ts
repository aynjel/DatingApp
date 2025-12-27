import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LogOutIcon, LucideAngularModule, PencilIcon } from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { AuthStore } from '../../../../shared/store/auth.store';
import { MemberStore } from '../../../../shared/store/member.store';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink,
    DatePipe,
    LucideAngularModule,
    AvatarComponent,
    SwalComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  protected authStore = inject(AuthStore);
  protected memberStore = inject(MemberStore);

  readonly logoutIcon = LogOutIcon;
  readonly editIcon = PencilIcon;
}
