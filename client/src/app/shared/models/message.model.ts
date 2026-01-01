export interface Message {
  id: string;
  senderId: string;
  senderDisplayName: string;
  senderImageUrl?: string;
  recipientId: string;
  recipientDisplayName: string;
  recipientImageUrl?: string;
  content: string;
  messageSent: string;
  dateRead?: string;
  senderDeleted: boolean;
  recipientDeleted: boolean;
}

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserDisplayName: string;
  otherUserImageUrl?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  isOnline?: boolean;
  lastActive?: string;
}
