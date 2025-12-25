import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import {
  BellIcon,
  HeartIcon,
  LogInIcon,
  LogOutIcon,
  LucideAngularModule,
  MenuIcon,
  MessageCircleIcon,
  SearchIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
  UsersRoundIcon,
} from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, LucideAngularModule, SwalComponent, AvatarComponent],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  protected authStore = inject(AuthStore);
  protected sidebarOpen = signal(false);

  readonly menuIcon = MenuIcon;
  readonly usersIcon = UsersRoundIcon;
  readonly heartIcon = HeartIcon;
  readonly peopleIcon = UsersIcon;
  readonly messageIcon = MessageCircleIcon;
  readonly settingsIcon = SettingsIcon;
  readonly logoutIcon = LogOutIcon;
  readonly searchIcon = SearchIcon;
  readonly bellIcon = BellIcon;
  readonly loginIcon = LogInIcon;
  readonly registerIcon = UserPlusIcon;

  readonly navigationLinks = [
    {
      label: 'Matches',
      icon: HeartIcon,
      routerLink: '/members/matches',
    },
    {
      label: 'People',
      icon: UsersIcon,
      routerLink: '/people/lists',
    },
    {
      label: 'Message',
      icon: MessageCircleIcon,
      routerLink: '/messages/inbox',
    },
    {
      label: 'Settings',
      icon: SettingsIcon,
      routerLink: '/profile/me',
    },
  ];

  toggleSidebar() {
    this.sidebarOpen.update((value) => !value);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
