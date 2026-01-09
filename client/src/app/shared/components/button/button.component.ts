import { Component, input, output } from '@angular/core';

type ButtonColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  onClick = output<void>();

  label = input<string>('Submit');
  type = input<string>('button');
  color = input<ButtonColor>('primary');
  size = input<ButtonSize>('md');
  additionalClasses = input<string>('');
  isResponsive = input<boolean>(false);
  isDisabled = input<boolean>(false);
  isLoading = input<boolean>(false);
}
