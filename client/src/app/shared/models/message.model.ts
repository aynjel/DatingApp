// Matches MessageResponseDto from backend
export interface Message {
  id: string;
  senderId: string;
  senderDisplayName: string;
  senderImageUrl: string;
  recipientId: string;
  recipientDisplayName: string;
  recipientImageUrl: string;
  content: string;
  messageSent: string;
  dateRead?: string;
}

// For creating new messages (matches CreateMessageRequestDto)
export interface CreateMessageRequest {
  recipientId: string;
  content: string;
}

// For message list queries (matches GetMessageParams)
export interface GetMessageParams {
  pageNumber: number;
  pageSize: number;
  container: MessageContainer;
}

export type MessageContainer = 'Inbox' | 'Outbox' | 'Unread';

// Client-side conversation interface (derived from messages)
export interface Conversation {
  id: string;
  senderId: string;
  senderDisplayName: string;
  senderImageUrl?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  isOnline?: boolean;
  lastActive?: string;
}
