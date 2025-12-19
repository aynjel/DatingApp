import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AvatarComponent } from 'ngx-avatar-2';
import { LoginFormComponent } from '../../../modules/auth/components/login-form/login-form.component';
import { RegisterFormComponent } from '../../../modules/auth/components/register-form/register-form.component';
import { AuthStore } from '../../../modules/auth/store/auth.store';
import { GlobalStore } from '../../../store/global.store';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    SwalComponent,
    ModalComponent,
    LoginFormComponent,
    RegisterFormComponent,
    AvatarComponent,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  protected globalStore = inject(GlobalStore);
  protected authStore = inject(AuthStore);

  protected readonly navigationLinks: { label: string; routerLink: string }[] =
    [
      {
        label: 'Matches',
        routerLink: '/portal/users',
      },
      {
        label: 'People',
        routerLink: '/portal/lists',
      },
      {
        label: 'Messages',
        routerLink: '/portal/messages',
      },
      // {
      //   label: 'Errors',
      //   routerLink: '/portal/errors',
      // },
    ];
}
