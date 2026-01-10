import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';
import { MemberDetailsFormComponent } from '../../components/member-details-form/member-details-form.component';
import { ProfileStore } from '../../store/profile.store';

@Component({
  selector: 'app-member-details',
  imports: [MemberDetailsFormComponent, LucideAngularModule, RouterLink],
  templateUrl: './member-details.component.html',
})
export class MemberDetailsComponent {
  private profileStore = inject(ProfileStore);

  readonly arrowLeftIcon = ArrowLeftIcon;

  protected memberDetails = computed(() =>
    this.profileStore.authStore.memberDetails()
  );
}
