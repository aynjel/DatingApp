import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  imports: [
    RouterLink,
    LucideAngularModule,
    SwalComponent,
    AvatarComponent,
    RouterLinkActive,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  private authStore = inject(AuthStore);
  protected sidebarOpen = signal(false);
  @ViewChild('sidebar') sidebarElement?: ElementRef<HTMLElement>;

  isLoggedIn = computed(() => this.authStore.isLoggedIn());
  user = computed(() => this.authStore.currentUser());

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
      routerLink: '/settings/account',
    },
  ];

  toggleSidebar() {
    this.sidebarOpen.update((value) => !value);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  onLogout() {
    this.authStore.logout();
    this.closeSidebar();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.sidebarOpen()) {
      this.closeSidebar();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.sidebarOpen()) {
      return;
    }

    const target = event.target as HTMLElement;
    const sidebar = this.sidebarElement?.nativeElement;
    const menuButton = (event.target as HTMLElement).closest(
      'button[aria-label="Toggle sidebar"]'
    );

    // Close sidebar if click is outside the sidebar and not on the menu toggle button
    if (sidebar && !sidebar.contains(target) && !menuButton) {
      this.closeSidebar();
    }
  }
}
