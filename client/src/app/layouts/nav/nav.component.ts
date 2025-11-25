import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LoginFormComponent } from '../../modules/auth/components/login-form/login-form.component';
import { RegisterFormComponent } from '../../modules/auth/components/register-form/register-form.component';
import { AuthService } from '../../modules/auth/services/auth.service';
import { AuthStore } from '../../modules/auth/store/auth.store';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { GlobalStore } from '../../store/global.store';

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
  protected globalStore = inject(GlobalStore);
  protected authStore = inject(AuthStore);
  protected authService = inject(AuthService);

  protected onLogout(): void {
    this.authService.logout();
  }

  handleOnClose() {
    console.log('Login modal closed');
  }
}
