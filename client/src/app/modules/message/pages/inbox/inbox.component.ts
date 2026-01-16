import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Conversation } from '../../../../shared/models/message.model';
import { AuthStore } from '../../../../shared/store/auth.store';
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ThreadComponent } from '../../components/message-thread/message-thread.component';
import { MessageStore } from '../../store/message.store';

@Component({
  selector: 'app-inbox',
  imports: [CommonModule, ConversationListComponent, ThreadComponent],
  templateUrl: './inbox.component.html',
})
export class InboxComponent {
  authStore = inject(AuthStore);
  messageStore = inject(MessageStore);

  currentUserId = computed(() => this.authStore.currentUser()?.userId || '');

  // Selected conversation
  selectedConversationId = signal<string | null>(null);

  conversations = computed(() => this.messageStore.conversations());

  currentThreadMessages = computed(() =>
    this.messageStore.currentThreadMessages()
  );

  constructor() {
    effect(() => {
      console.log(this.currentThreadMessages());
    });
  }

  /**
   * Handle conversation selection
   */
  onConversationSelected(conversationId: string): void {
    this.selectedConversationId.set(conversationId);
    this.messageStore.getMessageThread(conversationId);
  }

  /**
   * Handle message sent
   */
  onMessageSent(content: string): void {
    const conversationId = this.selectedConversationId();
    if (!conversationId) {
      console.warn('[Inbox] Cannot send message: no conversation selected');
      return;
    }

    this.messageStore.sendMessage({
      data: {
        recipientId: conversationId,
        content: content,
      },
    });
  }

  /**
   * Handle back navigation (on mobile)
   */
  onGoBack(): void {
    this.selectedConversationId.set(null);
  }

  /**
   * Get the selected conversation object
   */
  getSelectedConversation(): Conversation | undefined {
    const id = this.selectedConversationId();
    if (!id) return undefined;
    return this.conversations().find((c) => c.id === id);
  }
}
