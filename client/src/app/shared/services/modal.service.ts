import { Injectable, signal, Type } from '@angular/core';
import { ModalData } from '../models/modal.models';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  activeModal = signal<ModalData | null>(null);

  open<T>(component: Type<T>, inputs?: Partial<T>) {
    this.activeModal.set({ component, inputs });
  }

  close() {
    this.activeModal.set(null);
  }
}
