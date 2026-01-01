import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeartIcon, LucideAngularModule, MessageCircleIcon } from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Member } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, LucideAngularModule, AvatarComponent],
  templateUrl: './member-card.component.html',
})
export class MemberCardComponent {
  readonly heartIcon = HeartIcon;
  readonly messageIcon = MessageCircleIcon;

  member = input.required<Member>();

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
}

