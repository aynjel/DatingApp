import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Member } from '../../../../shared/models/member.model';
import { MatchActionsComponent } from '../match-actions/match-actions.component';
import { MatchCardComponent } from '../match-card/match-card.component';

@Component({
  selector: 'app-match-card-stack',
  imports: [CommonModule, MatchCardComponent, MatchActionsComponent],
  templateUrl: './match-card-stack.component.html',
})
export class MatchCardStackComponent {
  members = input.required<Member[]>();
  currentIndex = input.required<number>();
  swipeDirection = input<'left' | 'right' | null>(null);
  isAnimating = input<boolean>(false);

  onLike = output<void>();
  onPass = output<void>();

  currentMember = input<Member | null>(null);
  upcomingMembers = input<Member[]>([]);

  get hasMoreCards(): boolean {
    return this.currentIndex() < this.members().length;
  }

  get isStackEmpty(): boolean {
    return this.currentIndex() >= this.members().length;
  }
}
