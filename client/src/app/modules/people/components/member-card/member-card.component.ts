import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  HeartIcon,
  LucideAngularModule,
  MessageCircleIcon,
} from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Member } from '../../../../shared/models/member.model';
import { CalculateAgePipe } from '../../../../shared/pipes/calculate-age.pipe';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, LucideAngularModule, AvatarComponent, CalculateAgePipe],
  templateUrl: './member-card.component.html',
})
export class MemberCardComponent {
  readonly heartIcon = HeartIcon;
  readonly messageIcon = MessageCircleIcon;

  member = input.required<Member>();
}
