import { Component, input, output } from '@angular/core';
import { LucideAngularModule, MessageCircleIcon } from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Conversation } from '../../../../shared/models/message.model';

@Component({
  selector: 'app-conversation-list',
  imports: [LucideAngularModule, AvatarComponent],
  templateUrl: './conversation-list.component.html',
})
export class ConversationListComponent {
  readonly messageIcon = MessageCircleIcon;

  conversations = input.required<Conversation[]>();
  selectedConversationId = input<string | null>(null);
  conversationSelected = output<string>();

  onConversationClick(conversationId: string): void {
    this.conversationSelected.emit(conversationId);
  }

  getLastMessageTime(date?: string): string {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }
}
