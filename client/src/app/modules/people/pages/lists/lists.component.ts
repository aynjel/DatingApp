import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { MemberCardComponent } from '../../components/member-card/member-card.component';
import {
  PeopleFilterComponent,
  PeopleFilterParams,
} from '../../components/people-filter/people-filter.component';
import { PeopleStore } from '../../store/people.store';

@Component({
  selector: 'app-lists',
  imports: [MemberCardComponent, PeopleFilterComponent, PaginationComponent],
  templateUrl: './lists.component.html',
})
export class ListsComponent implements OnInit {
  private peopleStore = inject(PeopleStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  members = computed(() => this.peopleStore.members());
  pagination = computed(() => this.peopleStore.pagination());
  searchTerm = computed(() => this.peopleStore.searchTerm());

  pageNumber = signal(1);
  pageSize = signal(12);
  currentFilters = signal<PeopleFilterParams>({ searchTerm: '' });

  canGoPrevious = computed(() => this.pagination().currentPage > 1);
  canGoNext = computed(
    () => this.pagination().currentPage < this.pagination().totalPages
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const pageNumber = params['pageNumber']
        ? Number(params['pageNumber'])
        : 1;
      const pageSize = params['pageSize']
        ? Number(params['pageSize'])
        : this.pageSize();

      this.pageNumber.set(pageNumber);
      this.pageSize.set(pageSize);
      this.fetchMembers();
    });
  }

  private fetchMembers(): void {
    const filters = this.currentFilters();
    this.peopleStore.getMembers({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      searchTerm: filters.searchTerm,
    });
  }

  onFilterChange(filters: PeopleFilterParams): void {
    this.currentFilters.set(filters);
    this.pageNumber.set(1); // Reset to first page when filtering
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pageNumber: 1,
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
    // Fetch will be triggered by queryParams subscription
  }

  onPageChange(pageNumber: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pageNumber: pageNumber,
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
  }

  goToPrevious(): void {
    if (this.canGoPrevious()) {
      this.onPageChange(this.pagination().currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.canGoNext()) {
      this.onPageChange(this.pagination().currentPage + 1);
    }
  }
}
