import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  label = input<string>('Submit');
  type = input<string>('button');
  color = input<string>('primary');
  isLoading = input<boolean>(false);
}
