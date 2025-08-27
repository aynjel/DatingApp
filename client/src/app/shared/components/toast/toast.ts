import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Toast } from '../../models/user';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.html',
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];

  ngOnInit() {
    this.toasts = this.toastService.toasts();
  }

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
