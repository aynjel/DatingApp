import { Conversation, Message } from '../../../shared/models/message.model';

export const buildConversations = (
  messages: Message[],
  currentUserId: string
): Conversation[] => {
  const conversationMap = new Map<string, Conversation>();

  messages.forEach((msg) => {
    const senderId =
      msg.senderId === currentUserId ? msg.recipientId : msg.senderId;
    const senderDisplayName =
      msg.senderId === currentUserId
        ? msg.recipientDisplayName
        : msg.senderDisplayName;
    const senderImageUrl =
      msg.senderId === currentUserId
        ? msg.recipientImageUrl
        : msg.senderImageUrl;

    const existing = conversationMap.get(senderId);
    const msgDate = new Date(msg.messageSent);

    if (!existing || new Date(existing.lastMessageDate || 0) < msgDate) {
      conversationMap.set(senderId, {
        id: senderId,
        senderId,
        senderDisplayName,
        senderImageUrl,
        lastMessage: msg.content,
        lastMessageDate: msg.messageSent,
        unreadCount: msg.recipientId === currentUserId && !msg.dateRead ? 1 : 0,
      });
    }
  });

  return Array.from(conversationMap.values()).sort(
    (a, b) =>
      new Date(b.lastMessageDate || 0).getTime() -
      new Date(a.lastMessageDate || 0).getTime()
  );
};
