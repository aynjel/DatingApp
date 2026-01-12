import { Component, computed, input, model, output } from '@angular/core';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  imports: [LucideAngularModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pageNumber = model<number>(1);
  pageSize = model<number>(10);
  totalCount = input<number>(0);
  totalPages = input<number>(0);
  pageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);

  pageChanged = output<{
    pageNumber: number;
    pageSize: number;
  }>();

  lastItemIndex = computed(() =>
    Math.min(this.pageNumber() * this.pageSize(), this.totalCount())
  );

  readonly chevronLeftIcon = ChevronLeftIcon;
  readonly chevronRightIcon = ChevronRightIcon;

  onPageChange(pageNumber?: number, pageSize?: EventTarget | null): void {
    if (pageNumber) this.pageNumber.set(pageNumber);
    if (pageSize) {
      const size = (pageSize as HTMLSelectElement).value;
      this.pageSize.set(Number(size));
    }
    this.pageChanged.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    });
  }
}
