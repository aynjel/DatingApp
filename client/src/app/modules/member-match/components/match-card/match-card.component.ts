import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Member } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-match-card',
  imports: [CommonModule, LucideAngularModule, AvatarComponent],
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss'],
})
export class MatchCardComponent {
  member = input.required<Member>();
  isCurrent = input<boolean>(false);
  swipeDirection = input<'left' | 'right' | null>(null);
  stackIndex = input<number>(0);

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

  getStackTransform(): string {
    if (this.isCurrent()) {
      return '';
    }
    const i = this.stackIndex();
    return `translateY(${i * 8}px) scale(${1 - i * 0.03}) translateZ(${
      -i * 20
    }px)`;
  }

  getStackZIndex(): number {
    if (this.isCurrent()) {
      return 20;
    }
    return 10 - this.stackIndex();
  }

  getStackOpacity(): number {
    if (this.isCurrent()) {
      return 1;
    }
    return 1 - this.stackIndex() * 0.2;
  }
}
