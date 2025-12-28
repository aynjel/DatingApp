import { Component, input, output } from '@angular/core';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { PaginationHeaderResponse } from '../../models/common-models';

@Component({
  selector: 'app-pagination',
  imports: [LucideAngularModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pagination = input.required<PaginationHeaderResponse>();
  canGoPrevious = input<boolean>(false);
  canGoNext = input<boolean>(false);

  onPrevious = output<void>();
  onNext = output<void>();

  readonly chevronLeftIcon = ChevronLeftIcon;
  readonly chevronRightIcon = ChevronRightIcon;
}
