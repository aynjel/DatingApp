import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LogOutIcon, LucideAngularModule, PencilIcon } from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { AuthStore } from '../../../../shared/store/auth.store';

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
export class ProfileComponent implements OnInit {
  private authStore = inject(AuthStore);

  readonly logoutIcon = LogOutIcon;
  readonly editIcon = PencilIcon;

  protected memberDetails = computed(() => this.authStore.memberDetails());

  ngOnInit(): void {
    if (!this.authStore.memberDetails()) {
      this.authStore.getCurrentUser();
      console.log('getCurrentUser');
    }
  }

  onLogout() {
    this.authStore.logout();
  }
}
