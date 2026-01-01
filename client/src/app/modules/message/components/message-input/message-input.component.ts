import {
  Component,
  effect,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, PaperclipIcon, SendIcon } from 'lucide-angular';

@Component({
  selector: 'app-message-input',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './message-input.component.html',
})
export class MessageInputComponent {
  readonly sendIcon = SendIcon;
  readonly paperclipIcon = PaperclipIcon;

  messageSent = output<string>();

  messageContent = signal('');
  textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  constructor() {
    // Auto-resize textarea effect
    effect(() => {
      const textarea = this.textareaRef()?.nativeElement;
      if (textarea) {
        this.adjustTextareaHeight(textarea);
      }
    });
  }

  onSend(): void {
    const content = this.messageContent().trim();
    if (content) {
      this.messageSent.emit(content);
      this.messageContent.set('');
      // Reset textarea height after sending
      const textarea = this.textareaRef()?.nativeElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.adjustTextareaHeight(textarea);
  }

  private adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    const maxHeight = 120; // Maximum height in pixels (about 5-6 lines)
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  get hasContent(): boolean {
    return this.messageContent().trim().length > 0;
  }
}
