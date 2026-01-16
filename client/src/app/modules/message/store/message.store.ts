import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  Conversation,
  CreateMessageRequest,
  GetMessageParams,
  Message,
} from '../../../shared/models/message.model';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalStore } from '../../../shared/store/global.store';
import { buildConversations } from '../helper/buildConversations';
import { MessageService } from '../services/message.service';

type MessageStoreType = {
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | null;
  currentThreadMessages: Message[];
};

const initialState: MessageStoreType = {
  conversations: [],
  messages: [],
  selectedConversationId: null,
  currentThreadMessages: [],
};

export const MessageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    messageService: inject(MessageService),
    toastService: inject(ToastService),
  })),
  withMethods((store) => {
    const getMessages = store.globalStore.withApiState<
      GetMessageParams,
      HttpResponse<Message[]>
    >((params) =>
      store.messageService.getMessages(params).pipe(
        tapResponse({
          next: (response) => {
            patchState(store, { messages: response.body || [] });
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show('Failed to get messages', 'error');
          },
        })
      )
    );

    const getMessageThread = store.globalStore.withApiState<string, Message[]>(
      (recipientId) =>
        store.messageService.getMessageThread(recipientId).pipe(
          tapResponse({
            next: (response) => {
              patchState(store, { currentThreadMessages: response });
            },
            error: (error: HttpErrorResponse) => {
              store.toastService.show('Failed to get message thread', 'error');
            },
          })
        )
    );

    const sendMessage = store.globalStore.withFormSubmission<
      CreateMessageRequest,
      Message
    >((payload) =>
      store.messageService.sendMessage(payload).pipe(
        tapResponse({
          next: (response) => {
            patchState(store, {
              currentThreadMessages: [
                ...store.currentThreadMessages(),
                response,
              ],
            });
            store.toastService.show('Message sent successfully', 'success');
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show('Failed to send message', 'error');
          },
        })
      )
    );

    const deleteMessage = store.globalStore.withFormSubmission<string, void>(
      (messageId) =>
        store.messageService.deleteMessage(messageId).pipe(
          tapResponse({
            next: () => {
              patchState(store, {
                currentThreadMessages: store
                  .currentThreadMessages()
                  .filter((msg) => msg.id !== messageId),
              });
              store.toastService.show(
                'Message deleted successfully',
                'success'
              );
            },
            error: (error: HttpErrorResponse) => {
              store.toastService.show('Failed to delete message', 'error');
            },
          })
        )
    );

    const selectConversation = (conversationId: string) => {
      patchState(store, { selectedConversationId: conversationId });
    };

    const buildConversationsFromMessages = (currentUserId: string) => {
      const conversations = buildConversations(store.messages(), currentUserId);
      patchState(store, { conversations });
    };

    return {
      getMessages,
      getMessageThread,
      sendMessage,
      deleteMessage,
      selectConversation,
      buildConversationsFromMessages,
    };
  })
);
