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
  protected authStore = inject(AuthStore);
  private router = inject(Router);

  protected isMemberDetailsSetup: Signal<boolean> = computed(() => {
    const currentUser = this.authStore.currentUser();
    if (!currentUser) return false;
    return !!currentUser.memberDetails;
  });

  private _checkMemberDetails = effect(() => {
    const currentUser = this.authStore.currentUser();

    // If member details are not set up, redirect to setup page
    if (currentUser && !currentUser.memberDetails) {
      const userId = currentUser.userId;
      if (userId) {
        this.router.navigate(['/profile/member-details', userId]);
      }
    }
  });
}
