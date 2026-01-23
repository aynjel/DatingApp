import { DatePipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule, SendIcon } from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Message } from '../../../../shared/models/message.model';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-message-thread',
  imports: [
    DatePipe,
    LucideAngularModule,
    AvatarComponent,
    MessageInputComponent,
    RouterLink,
  ],
  templateUrl: './message-thread.component.html',
})
export class ThreadComponent {
  readonly arrowLeftIcon = ArrowLeftIcon;
  readonly sendIcon = SendIcon;

  messages = input.required<Message[]>();
  currentUserId = input.required<string>();
  otherUserId = input.required<string>();
  otherUserDisplayName = input.required<string>();
  otherUserImageUrl = input<string | undefined>(undefined);
  isOnline = input<boolean>(false);
  lastActive = input<string | undefined>(undefined);

  messageSent = output<string>();
  goBack = output<void>();

  messagesContainer =
    viewChild<ElementRef<HTMLDivElement>>('messagesContainer');

  constructor() {
    // Auto-scroll to bottom when messages change
    effect(() => {
      const messages = this.messages();
      if (messages && messages.length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  onGoBack(event: Event): void {
    event.stopPropagation();
    this.goBack.emit();
  }

  onMessageSent(content: string): void {
    this.messageSent.emit(content);
  }

  isMessageFromCurrentUser(message: Message): boolean {
    return message.senderId === this.currentUserId();
  }

  getLastActiveText(lastActive?: string): string {
    if (!lastActive) return '';
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

  private scrollToBottom(): void {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
