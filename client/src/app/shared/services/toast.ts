import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 500) {
    const toast: Toast = {
      id: new Date().getTime() + this.counter++,
      message,
      type,
      duration,
    };
    this.toasts.set([...this.toasts(), toast]);

    setTimeout(() => this.remove(toast.id), duration);
  }

  remove(id: number) {
    this.toasts.set(this.toasts().filter((t) => t.id !== id));
    console.log(`Removing toast with id: ${id}`);
    console.log(`Current toasts: ${JSON.stringify(this.toasts())}`);
  }
}
