import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = this.counter++;
    const newToast: Toast = {
      id,
      message,
      type,
      duration,
    };
    this.toasts.set([...this.toasts(), newToast]);
    console.log(`Showing toast: ${JSON.stringify(newToast)}`);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: number) {
    this.toasts.set(this.toasts().filter((t) => t.id !== id));
    console.log(`Removing toast with id: ${id}`);
    console.log(`Current toasts: ${JSON.stringify(this.toasts())}`);
  }
}
