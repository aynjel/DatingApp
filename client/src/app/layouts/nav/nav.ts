import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Auth } from '../../shared/services/auth';
import { LoginModal } from '../components/login-modal/login-modal';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, LoginModal, SwalComponent],
  templateUrl: './nav.html',
})
export class Nav {
  protected authService = inject(Auth);

  @ViewChild(LoginModal) loginModal!: LoginModal;

  protected onLogout(): void {
    this.authService.logout();
  }

  openLoginModal() {
    this.loginModal.open();
  }
}
