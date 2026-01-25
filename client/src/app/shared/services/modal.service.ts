import { Injectable, signal, Type } from '@angular/core';
import { ModalData } from '../models/modal.models';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  activeModal = signal<ModalData | null>(null);
  private onCloseCallback: ((data?: any) => void) | null = null;

  open<T>(
    component: Type<T>,
    inputs?: Partial<T>,
    onClose?: (data?: any) => void,
  ) {
    this.onCloseCallback = onClose || null;
    this.activeModal.set({ component, inputs });
  }

  close(data?: any) {
    if (this.onCloseCallback) {
      this.onCloseCallback(data);
    }
    this.onCloseCallback = null;
    this.activeModal.set(null);
  }
}
