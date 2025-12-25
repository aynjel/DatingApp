import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  HeartIcon,
  LucideAngularModule,
  MessageCircleIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
} from 'lucide-angular';
import { AuthStore } from '../../shared/store/auth.store';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected authStore = inject(AuthStore);

  readonly heartIcon = HeartIcon;
  readonly usersIcon = UsersIcon;
  readonly messageCircleIcon = MessageCircleIcon;
  readonly sparklesIcon = SparklesIcon;
  readonly arrowRightIcon = ArrowRightIcon;
  readonly shieldIcon = ShieldIcon;
  readonly starIcon = StarIcon;
  readonly checkCircle2Icon = CheckCircle2Icon;
}
