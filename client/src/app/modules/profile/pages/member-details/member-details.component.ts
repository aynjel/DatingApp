import { Component, computed, inject } from '@angular/core';
import { MemberDetailsFormComponent } from '../../components/member-details-form/member-details-form.component';
import { ProfileStore } from '../../store/profile.store';

@Component({
  selector: 'app-member-details',
  imports: [MemberDetailsFormComponent],
  templateUrl: './member-details.component.html',
})
export class MemberDetailsComponent {
  private profileStore = inject(ProfileStore);

  protected memberDetails = computed(() =>
    this.profileStore.authStore.memberDetails()
  );
}
