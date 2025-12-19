import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';

type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  type = input<AlertType>('info');
  message = input.required<string>();
  dismissible = input<boolean>(false);

  isVisible = signal<boolean>(true);

  close() {
    this.isVisible.set(false);
  }

  get alertClass() {
    switch (this.type()) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  }
}
