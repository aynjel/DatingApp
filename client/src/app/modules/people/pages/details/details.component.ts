import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ArrowLeftIcon,
  HeartIcon,
  LucideAngularModule,
  MessageCircleIcon,
} from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Member } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-member-details',
  imports: [DatePipe, LucideAngularModule, AvatarComponent],
  templateUrl: './details.component.html',
})
export class MemberDetailsComponent {
  private route = inject(ActivatedRoute);

  readonly arrowLeftIcon = ArrowLeftIcon;
  readonly heartIcon = HeartIcon;
  readonly messageIcon = MessageCircleIcon;

  member = this.route.snapshot.data['member'] as Member | null;

  goBack(): void {
    window.history.back();
  }

  calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  getLastActiveText(lastActive: string): string {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffInMs = now.getTime() - lastActiveDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Active today';
    } else if (diffInDays === 1) {
      return 'Active yesterday';
    } else if (diffInDays < 7) {
      return `Active ${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Active ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `Active ${months} month${months > 1 ? 's' : ''} ago`;
    }
  }
}
