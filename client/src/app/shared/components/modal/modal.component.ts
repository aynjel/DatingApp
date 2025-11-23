import { Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  title = input<string>('');
  onClose = output<void>();

  modalRef = viewChild<ElementRef<HTMLDialogElement>>('modalRef');

  open() {
    if (this.modalRef) {
      this.modalRef()?.nativeElement.showModal();
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef()?.nativeElement.close();
      this.onClose.emit();
    }
  }
}
