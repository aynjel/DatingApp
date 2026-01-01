import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeartIcon, LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-match-actions',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './match-actions.component.html',
})
export class MatchActionsComponent {
  memberId = input.required<string>();
  isAnimating = input<boolean>(false);

  onLike = output<void>();
  onPass = output<void>();

  readonly heartIcon = HeartIcon;
  readonly xIcon = XIcon;

  handleLike(): void {
    if (!this.isAnimating()) {
      this.onLike.emit();
    }
  }

  handlePass(): void {
    if (!this.isAnimating()) {
      this.onPass.emit();
    }
  }
}
