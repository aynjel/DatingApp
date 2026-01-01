import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Conversation, Message } from '../../../../shared/models/message.model';
import { AuthStore } from '../../../../shared/store/auth.store';
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ThreadComponent } from '../../components/message-thread/message-thread.component';
import { MessageStore } from '../../store/message.store';

@Component({
  selector: 'app-inbox',
  imports: [ConversationListComponent, ThreadComponent],
  templateUrl: './inbox.component.html',
})
export class InboxComponent {
  private messageStore = inject(MessageStore);
  private authStore = inject(AuthStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedConversationId = signal<string | null>(null);
  conversations = signal<Conversation[]>([]);
  messages = signal<Message[]>([]);

  currentUserId = computed(() => this.authStore.currentUser()?.userId || '');

  constructor() {
    // Initialize with mock data
    this.initializeMockData();

    // Check if there's a conversation ID in the route
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.selectedConversationId.set(params['id']);
        this.loadMessagesForConversation(params['id']);
      }
    });
  }

  private initializeMockData(): void {
    // Mock conversations
    const mockConversations: Conversation[] = [
      {
        id: '1',
        otherUserId: 'user-2',
        otherUserDisplayName: 'Sarah Johnson',
        otherUserImageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        lastMessage: 'Hey! How are you doing?',
        lastMessageDate: new Date(
          Date.now() - 2 * 60 * 60 * 1000
        ).toISOString(),
        unreadCount: 2,
        isOnline: true,
        lastActive: new Date().toISOString(),
      },
      {
        id: '2',
        otherUserId: 'user-3',
        otherUserDisplayName: 'Emily Davis',
        otherUserImageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        lastMessage: 'Thanks for the message!',
        lastMessageDate: new Date(
          Date.now() - 5 * 60 * 60 * 1000
        ).toISOString(),
        unreadCount: 0,
        isOnline: false,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        otherUserId: 'user-4',
        otherUserDisplayName: 'Jessica Martinez',
        otherUserImageUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        lastMessage: 'Looking forward to meeting you!',
        lastMessageDate: new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toISOString(),
        unreadCount: 1,
        isOnline: false,
        lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        otherUserId: 'user-5',
        otherUserDisplayName: 'Amanda Wilson',
        lastMessage: 'Have a great day!',
        lastMessageDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        unreadCount: 0,
        isOnline: false,
        lastActive: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ];

    this.conversations.set(mockConversations);

    // Mock messages for conversation 1
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        senderId: 'user-2',
        senderDisplayName: 'Sarah Johnson',
        senderImageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        recipientId: this.currentUserId(),
        recipientDisplayName: 'You',
        content: 'Hey! How are you doing?',
        messageSent: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        senderDeleted: false,
        recipientDeleted: false,
      },
      {
        id: 'msg-2',
        senderId: this.currentUserId(),
        senderDisplayName: 'You',
        recipientId: 'user-2',
        recipientDisplayName: 'Sarah Johnson',
        recipientImageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        content: "I'm doing great, thanks for asking! How about you?",
        messageSent: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        dateRead: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        senderDeleted: false,
        recipientDeleted: false,
      },
      {
        id: 'msg-3',
        senderId: 'user-2',
        senderDisplayName: 'Sarah Johnson',
        senderImageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        recipientId: this.currentUserId(),
        recipientDisplayName: 'You',
        content: "I'm doing well too! Would you like to grab coffee sometime?",
        messageSent: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        senderDeleted: false,
        recipientDeleted: false,
      },
    ];

    this.messages.set(mockMessages);
  }

  onConversationSelected(conversationId: string): void {
    this.selectedConversationId.set(conversationId);
    this.router.navigate(['/messages/thread', conversationId]);
    this.loadMessagesForConversation(conversationId);
  }

  private loadMessagesForConversation(conversationId: string): void {
    // Mock messages based on conversation ID
    const conversation = this.conversations().find(
      (c) => c.id === conversationId
    );
    if (!conversation) return;

    const mockMessages: Message[] = [
      {
        id: `msg-${conversationId}-1`,
        senderId: conversation.otherUserId,
        senderDisplayName: conversation.otherUserDisplayName,
        senderImageUrl: conversation.otherUserImageUrl,
        recipientId: this.currentUserId(),
        recipientDisplayName: 'You',
        content: conversation.lastMessage || 'Hello!',
        messageSent: conversation.lastMessageDate || new Date().toISOString(),
        senderDeleted: false,
        recipientDeleted: false,
      },
    ];

    this.messages.set(mockMessages);
  }

  onMessageSent(content: string): void {
    const conversationId = this.selectedConversationId();
    if (!conversationId) return;

    const conversation = this.conversations().find(
      (c) => c.id === conversationId
    );
    if (!conversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: this.currentUserId(),
      senderDisplayName: 'You',
      recipientId: conversation.otherUserId,
      recipientDisplayName: conversation.otherUserDisplayName,
      recipientImageUrl: conversation.otherUserImageUrl,
      content,
      messageSent: new Date().toISOString(),
      senderDeleted: false,
      recipientDeleted: false,
    };

    this.messages.update((msgs) => [...msgs, newMessage]);

    // Update conversation last message
    this.conversations.update((convs) =>
      convs.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: content,
              lastMessageDate: new Date().toISOString(),
            }
          : conv
      )
    );
  }

  onGoBack(): void {
    this.selectedConversationId.set(null);
    this.router.navigate(['/messages/inbox']);
  }

  getSelectedConversation(): Conversation | undefined {
    const id = this.selectedConversationId();
    return id ? this.conversations().find((c) => c.id === id) : undefined;
  }
}
