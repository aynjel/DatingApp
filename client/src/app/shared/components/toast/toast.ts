import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Toast } from '../../models/user.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.html',
})
export class ToastComponent {
  private toastService = inject(ToastService);
  protected toasts = this.toastService.toasts;

  getClass(type: Toast['type']) {
    return {
      'alert-success': type === 'success',
      'alert-error': type === 'error',
      'alert-info': type === 'info',
      'alert-warning': type === 'warning',
    };
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
