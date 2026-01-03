import { Component, computed, effect, inject, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from '@component/toast/toast.component';
import { NavComponent } from './shared/components/nav/nav.component';
import { AuthStore } from './shared/store/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, ToastComponent],
  template: `
    <!-- @if(authStore.isLoggedIn() && isMemberDetailsSetup()) { -->
    <app-nav />
    <!-- } -->
    <div id="main-content" class="mt-[4rem] w-full transition-all duration-300">
      <!-- [ngClass]="{
        'mt-[4rem]': authStore.isLoggedIn() && isMemberDetailsSetup()
      }" -->
      <router-outlet />
    </div>
    <app-toast />
  `,
})
export class AppComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  protected isLoggedIn: Signal<boolean> = computed(() => {
    return this.authStore.isLoggedIn();
  });

  protected isMemberDetailsSetup: Signal<boolean> = computed(() => {
    const memberDetails = this.authStore.memberDetails();
    if (!memberDetails) return false;
    return !!memberDetails;
  });

  private _checkMemberDetails = effect(() => {
    const currentUser = this.authStore.currentUser();
    const memberDetails = this.authStore.memberDetails();
    const currentUrl = this.router.url;

    // If member details are not set up, redirect to setup page
    // But skip if already on the member-details page to avoid redirect loops
    if (
      currentUser &&
      !memberDetails &&
      !currentUrl.includes('/profile/member-details')
    ) {
      const userId = currentUser.userId;
      if (userId) {
        this.router.navigate(['/profile/member-details', userId]);
      }
    }
  });
}
