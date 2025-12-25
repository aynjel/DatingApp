import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AvatarComponent } from 'ngx-avatar-2';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, SwalComponent, AvatarComponent],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  protected authStore = inject(AuthStore);

  protected readonly navigationLinks: { label: string; routerLink: string }[] =
    [
      {
        label: 'Matches',
        routerLink: '/members/matches',
      },
      {
        label: 'People',
        routerLink: '/people/lists',
      },
      {
        label: 'Messages',
        routerLink: '/messages/inbox',
      },
      // {
      //   label: 'Errors',
      //   routerLink: '/portal/errors',
      // },
    ];
}
