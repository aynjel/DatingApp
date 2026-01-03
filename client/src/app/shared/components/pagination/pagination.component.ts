import { Component, computed, input, output } from '@angular/core';
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
  onPageNumberChange = output<number>();

  currentPage = computed(() => this.pagination().currentPage);
  totalPages = computed(() => this.pagination().totalPages);

  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  readonly chevronLeftIcon = ChevronLeftIcon;
  readonly chevronRightIcon = ChevronRightIcon;

  goToPrevious(): void {
    if (this.canGoPrevious()) {
      this.onPageNumberChange.emit(this.currentPage() - 1);
    }
  }

  goToNext(): void {
    if (this.canGoNext()) {
      this.onPageNumberChange.emit(this.currentPage() + 1);
    }
  }
}
