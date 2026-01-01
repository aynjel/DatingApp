import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FilterIcon,
  LucideAngularModule,
  SearchIcon,
  XIcon,
} from 'lucide-angular';

export interface PeopleFilterParams {
  searchTerm: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  city?: string;
  country?: string;
}

@Component({
  selector: 'app-people-filter',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './people-filter.component.html',
})
export class PeopleFilterComponent {
  readonly searchIcon = SearchIcon;
  readonly filterIcon = FilterIcon;
  readonly xIcon = XIcon;

  searchTerm = input<string>('');
  showFilters = signal(false);

  filterChanged = output<PeopleFilterParams>();

  searchInput = signal('');
  genderFilter = signal<string>('');
  minAgeFilter = signal<number | undefined>(undefined);
  maxAgeFilter = signal<number | undefined>(undefined);
  cityFilter = signal('');
  countryFilter = signal('');

  constructor() {
    // Initialize search input from input
    effect(() => {
      this.searchInput.set(this.searchTerm());
    });
  }

  onSearch(): void {
    this.emitFilterChange();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput.set(value);
    // Debounce search - emit after user stops typing
    this.emitFilterChange();
  }

  onClearSearch(): void {
    this.searchInput.set('');
    this.emitFilterChange();
  }

  toggleFilters(): void {
    this.showFilters.update((value) => !value);
  }

  onFilterChange(): void {
    this.emitFilterChange();
  }

  onClearFilters(): void {
    this.genderFilter.set('');
    this.minAgeFilter.set(undefined);
    this.maxAgeFilter.set(undefined);
    this.cityFilter.set('');
    this.countryFilter.set('');
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    const filters: PeopleFilterParams = {
      searchTerm: this.searchInput().trim(),
      gender: this.genderFilter() || undefined,
      minAge: this.minAgeFilter(),
      maxAge: this.maxAgeFilter(),
      city: this.cityFilter().trim() || undefined,
      country: this.countryFilter().trim() || undefined,
    };

    this.filterChanged.emit(filters);
  }

  hasActiveFilters(): boolean {
    return (
      !!this.genderFilter() ||
      !!this.minAgeFilter() ||
      !!this.maxAgeFilter() ||
      !!this.cityFilter() ||
      !!this.countryFilter()
    );
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.genderFilter()) count++;
    if (this.minAgeFilter()) count++;
    if (this.maxAgeFilter()) count++;
    if (this.cityFilter()) count++;
    if (this.countryFilter()) count++;
    return count;
  }

  onMinAgeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.minAgeFilter.set(value ? +value : undefined);
    this.onFilterChange();
  }

  onMaxAgeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.maxAgeFilter.set(value ? +value : undefined);
    this.onFilterChange();
  }
}
