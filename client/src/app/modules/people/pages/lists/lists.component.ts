import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { GlobalStore } from '../../../../shared/store/global.store';
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
  private globalStore = inject(GlobalStore);
  private peopleStore = inject(PeopleStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  members = computed(() => this.peopleStore.members());
  pagination = computed(() => this.peopleStore.pagination());
  searchTerm = computed(() => this.peopleStore.searchTerm());

  isLoading = computed(() => this.globalStore.isLoading());

  pageNumber = signal(1);
  pageSize = signal(10);
  currentFilters = signal<PeopleFilterParams>({ searchTerm: '' });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.pageNumber.update((prev) =>
        params['pageNumber'] ? Number(params['pageNumber']) : prev
      );
      this.pageSize.update((prev) =>
        params['pageSize'] ? Number(params['pageSize']) : prev
      );
      this.currentFilters.update((prev) =>
        params['searchTerm']
          ? { ...prev, searchTerm: params['searchTerm'] }
          : prev
      );
      this.currentFilters.update((prev) =>
        params['gender'] ? { ...prev, gender: params['gender'] } : prev
      );
      this.currentFilters.update((prev) =>
        params['minAge'] ? { ...prev, minAge: Number(params['minAge']) } : prev
      );
      this.currentFilters.update((prev) =>
        params['maxAge'] ? { ...prev, maxAge: Number(params['maxAge']) } : prev
      );
      this.currentFilters.update((prev) =>
        params['city'] ? { ...prev, city: params['city'] } : prev
      );
      this.currentFilters.update((prev) =>
        params['country'] ? { ...prev, country: params['country'] } : prev
      );
      this.fetchMembers();
    });
  }

  private fetchMembers(): void {
    const filters = this.currentFilters();
    this.peopleStore.getMembers({
      searchTerm: filters.searchTerm,
      gender: filters.gender,
      minAge: filters.minAge,
      maxAge: filters.maxAge,
      city: filters.city,
      country: filters.country,
      pagination: {
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
      },
    });
  }

  onFilterChange(filters: PeopleFilterParams): void {
    this.currentFilters.set(filters);
    // Reset to page 1 when filters change
    this.pageNumber.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: filters.searchTerm,
        gender: filters.gender,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        city: filters.city,
        country: filters.country,
        pageNumber: 1,
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(pageNumber: number): void {
    this.pageNumber.set(pageNumber);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pageNumber: pageNumber,
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
    this.fetchMembers();
  }
}
