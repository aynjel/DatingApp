import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterIcon, LucideAngularModule } from 'lucide-angular';
import { MemberParams } from '../../../../shared/models/member.model';
import { Pagination } from '../../../../shared/models/pagination.models';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-people-filter',
  imports: [FormsModule, LucideAngularModule, PaginationComponent],
  templateUrl: './people-filter.component.html',
})
export class PeopleFilterComponent {
  readonly filterIcon = FilterIcon;

  pagination = input.required<Pagination>();
  showFilters = signal(false);

  filterChanged = output<MemberParams>();
  genderFilter = signal<string>('');
  minAgeFilter = signal<number>(18);
  maxAgeFilter = signal<number>(99);
  orderBy = signal<'lastActive' | 'created'>('lastActive');

  onPageChanged = output<{ pageNumber: number; pageSize: number }>();

  toggleFilters(): void {
    this.showFilters.update((value) => !value);
  }

  onSubmitFilters(): void {
    // Emit all filters when submit button is clicked
    this.emitFilterChange();
  }

  onClearFilters(): void {
    this.genderFilter.set('');
    this.minAgeFilter.set(18);
    this.maxAgeFilter.set(99);
    this.orderBy.set('lastActive');
    // Emit empty filters immediately when clearing
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    const filters = new MemberParams();

    filters.gender = this.genderFilter();
    filters.minAge = this.minAgeFilter();
    filters.maxAge = this.maxAgeFilter();
    filters.orderBy = this.orderBy();

    this.filterChanged.emit(filters);
  }

  hasActiveFilters(): boolean {
    return (
      !!this.genderFilter() ||
      !!this.minAgeFilter() ||
      !!this.maxAgeFilter() ||
      !!this.orderBy()
    );
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.genderFilter()) count++;
    if (this.minAgeFilter()) count++;
    if (this.maxAgeFilter()) count++;
    if (this.orderBy()) count++;
    return count;
  }

  onMinAgeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    let newMin = value ? +value : 18;
    // Ensure min doesn't exceed max - clamp to max if it does
    if (newMin > this.maxAgeFilter()) {
      newMin = this.maxAgeFilter();
    }
    this.minAgeFilter.set(newMin);
  }

  onMaxAgeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    let newMax = value ? +value : 99;
    // Ensure max doesn't go below min - clamp to min if it does
    if (newMax < this.minAgeFilter()) {
      newMax = this.minAgeFilter();
    }
    this.maxAgeFilter.set(newMax);
  }

  onPageChange(event: { pageNumber: number; pageSize: number }): void {
    this.onPageChanged.emit(event);
  }
}
