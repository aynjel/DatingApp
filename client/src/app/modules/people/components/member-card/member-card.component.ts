import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  HeartIcon,
  LucideAngularModule,
  MessageCircleIcon,
  MessageSquareIcon,
} from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Member } from '../../../../shared/models/member.model';
import { CalculateAgePipe } from '../../../../shared/pipes/calculate-age.pipe';
import { PeopleStore } from '../../store/people.store';

@Component({
  selector: 'app-member-card',
  imports: [
    RouterLink,
    LucideAngularModule,
    AvatarComponent,
    CalculateAgePipe,
    SlicePipe,
  ],
  templateUrl: './member-card.component.html',
})
export class MemberCardComponent {
  peopleStore = inject(PeopleStore);

  readonly heartIcon = HeartIcon;
  readonly messageIcon = MessageCircleIcon;
  readonly messageSquareIcon = MessageSquareIcon;

  member = input.required<Member>();

  hasLiked = computed(() =>
    this.peopleStore.likedMemberIds()?.includes(this.member().id),
  );

  toggleLike(event: Event): void {
    event.stopPropagation();
    this.peopleStore.toggleLike(this.member().id);
  }
}
