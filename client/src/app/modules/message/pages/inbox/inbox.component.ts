import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class InboxComponent implements OnInit {
  authStore = inject(AuthStore);
  messageStore = inject(MessageStore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  currentUserId = computed(() => this.authStore.currentUser()?.userId || '');

  // Selected conversation
  selectedConversationId = signal<string | null>(null);

  conversations = computed(() => this.messageStore.conversations());

  currentThreadMessages = computed(() =>
    this.messageStore.currentThreadMessages(),
  );

  ngOnInit(): void {
    // React to recipientId in the route to open a specific thread
    this.route.paramMap.subscribe((params) => {
      const recipientId = params.get('recipientId');
      if (recipientId) {
        this.loadConversation(recipientId);
      } else {
        this.selectedConversationId.set(null);
      }
    });
  }

  /**
   * Handle conversation selection
   */
  onConversationSelected(conversationId: string): void {
    this.router.navigate(['/messages/inbox', conversationId]);
    this.loadConversation(conversationId);
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
    this.messageStore.selectConversation(null);
    this.router.navigate(['/messages/inbox']);
  }

  /**
   * Get the selected conversation object
   */
  getSelectedConversation(): Conversation | undefined {
    const id = this.selectedConversationId();
    if (!id) return undefined;
    return this.conversations().find((c) => c.id === id);
  }

  private loadConversation(conversationId: string): void {
    if (this.selectedConversationId() === conversationId) return;

    this.selectedConversationId.set(conversationId);
    this.messageStore.selectConversation(conversationId);
    this.messageStore.getMessageThread(conversationId);
  }
}
