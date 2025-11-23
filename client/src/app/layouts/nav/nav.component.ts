import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { Auth } from '../../shared/services/auth';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { RegisterFormComponent } from '../components/register-form/register-form.component';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    SwalComponent,
    ModalComponent,
    LoginFormComponent,
    RegisterFormComponent,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  protected authService = inject(Auth);

  protected onLogout(): void {
    this.authService.logout();
  }

  handleOnClose() {
    console.log('Login modal closed');
  }
}
