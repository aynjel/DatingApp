import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  imports: [NgComponentOutlet],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  modalService = inject(ModalService);

  modalRef = viewChild<ElementRef<HTMLDialogElement>>('modalElement');

  constructor() {
    // Sync the signal state with the native <dialog> API
    effect(() => {
      const el = this.modalRef()?.nativeElement;
      if (this.modalService.activeModal()) {
        el?.showModal(); // Native API for top-layer rendering
      } else {
        el?.close();
      }
    });
  }

  close() {
    const modal = this.modalService.activeModal();
    this.modalService.close(modal?.inputs);
  }
}
