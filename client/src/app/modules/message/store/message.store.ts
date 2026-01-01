import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { PaginationParams } from '../../../shared/models/common-models';
import { Conversation, Message } from '../../../shared/models/message.model';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalStore } from '../../../shared/store/global.store';
import { MessageService } from '../services/message.service';

type MessageStoreType = {
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | null;
};

const initialState: MessageStoreType = {
  conversations: [],
  messages: [],
  selectedConversationId: null,
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
    const getConversations = store.globalStore.withApiState<
      PaginationParams,
      Conversation[]
    >(() =>
      store.messageService.getConversations().pipe(
        tapResponse({
          next: (response) => {
            patchState(store, { conversations: response });
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show('Failed to get conversations', 'error');
          },
        })
      )
    );

    const getMessages = store.globalStore.withApiState<
      PaginationParams,
      Message[]
    >(() =>
      store.messageService.getMessages().pipe(
        tapResponse({
          next: (response) => {
            patchState(store, { messages: response });
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show('Failed to get messages', 'error');
          },
        })
      )
    );

    const sendMessage = store.globalStore.withFormSubmission<Message, Message>(
      (payload) =>
        store.messageService.sendMessage(payload).pipe(
          tapResponse({
            next: (response) => {
              patchState(store, { messages: [...store.messages(), response] });
              store.toastService.show('Message sent successfully', 'success');
            },
            error: (error: HttpErrorResponse) => {
              store.toastService.show('Failed to send message', 'error');
            },
          })
        )
    );

    const selectConversation = (conversationId: string) => {
      patchState(store, { selectedConversationId: conversationId });
    };

    return {
      getConversations,
      getMessages,
      sendMessage,
      selectConversation,
    };
  })
);
