import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthStore } from '../../shared/store/auth.store';

@Component({
  selector: 'app-home',
  imports: [RouterLink, IconComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected authStore = inject(AuthStore);

  protected Heart = Heart;
  protected Users = Users;
  protected MessageCircle = MessageCircle;
  protected Sparkles = Sparkles;
  protected Shield = Shield;
  protected Star = Star;
  protected ArrowRight = ArrowRight;
  protected CheckCircle2 = CheckCircle2;
}
