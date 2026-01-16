import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { MessageContainer } from '../../../../shared/models/message.model';
import { AuthStore } from '../../../../shared/store/auth.store';
import { MessageStore } from '../../store/message.store';

@Component({
  selector: 'app-message',
  imports: [RouterOutlet],
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
  authStore = inject(AuthStore);
  messageStore = inject(MessageStore);
  router = inject(Router);
  route = inject(ActivatedRoute);

  pageNumber = signal(1);
  pageSize = signal(20);
  containerName = signal<MessageContainer>('Inbox');
  selectedConversationId = signal<string | null>(null);

  messages = computed(() => this.messageStore.messages());
  conversations = computed(() => this.messageStore.conversations());
  currentThreadMessages = computed(() =>
    this.messageStore.currentThreadMessages()
  );
  currentUserId = computed(() => this.authStore.currentUser()?.userId || '');

  readonly TABS: MessageContainer[] = ['Inbox', 'Outbox'];

  constructor() {
    // Watch for messages changes and rebuild conversations
    effect(() => {
      const messages = this.messages();
      const userId = this.currentUserId();
      if (messages.length > 0 && userId) {
        this.messageStore.buildConversationsFromMessages(userId);
      }
    });
  }

  ngOnInit(): void {
    // Check for messageId in route params
    this.route.params.subscribe((params) => {
      if (params['messageId']) {
        const messageId = params['messageId'];
        console.log('[Messages] Thread ID detected:', messageId);
        // messageId will be used by InboxComponent to load the thread
      }
    });

    // Load messages for the current container
    const shouldLoad = this.syncContainerWithRoute();
    if (shouldLoad) {
      this.loadMessages();
    }

    // React to navigation changes
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const updated = this.syncContainerWithRoute();
        if (updated) {
          this.loadMessages();
        }
      }
    });
  }

  onTabSelected(container: MessageContainer): void {
    this.containerName.set(container);
    this.router.navigate(['/messages', container.toLowerCase()]);
    this.loadMessages();
  }

  private loadMessages(): void {
    console.log(
      '[Messages] Loading messages for container:',
      this.containerName()
    );
    this.messageStore.getMessages({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      container: this.containerName(),
    });
  }

  private syncContainerWithRoute(): boolean {
    const url = this.router.url.toLowerCase();
    if (url.includes('/messages/outbox')) {
      this.containerName.set('Outbox');
      return true;
    }
    // Default to Inbox for both /messages/inbox and /messages/thread/:id
    if (url.includes('/messages/inbox') || url.includes('/messages/thread')) {
      this.containerName.set('Inbox');
      return true;
    }
    return false;
  }
}
