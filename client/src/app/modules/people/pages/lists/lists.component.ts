import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberParams } from '../../../../shared/models/member.model';
import { MemberCardComponent } from '../../components/member-card/member-card.component';
import { PeopleFilterComponent } from '../../components/people-filter/people-filter.component';
import { PeopleStore } from '../../store/people.store';

@Component({
  selector: 'app-lists',
  imports: [MemberCardComponent, PeopleFilterComponent],
  templateUrl: './lists.component.html',
})
export class ListsComponent implements OnInit {
  private peopleStore = inject(PeopleStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  members = computed(() => this.peopleStore.members());
  pagination = computed(() => this.peopleStore.pagination());

  isLoading = computed(() => this.peopleStore.globalStore.isLoading());

  pageNumber = signal(1);
  pageSize = signal(10);
  currentFilters = signal<MemberParams>(new MemberParams());

  ngOnInit(): void {
    this.fetchMembers();
  }

  private fetchMembers(): void {
    const filters = this.currentFilters();
    this.peopleStore.getMembers({
      gender: filters.gender,
      minAge: filters.minAge,
      maxAge: filters.maxAge,
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      orderBy: filters.orderBy,
    });
    this.peopleStore.getLikeIds();
  }

  onFilterChange(filters: MemberParams): void {
    this.currentFilters.set(filters);
    // Reset to page 1 when filters change
    this.pageNumber.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        gender: filters.gender,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        pageNumber: 1,
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
    this.fetchMembers();
  }

  onPageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pageNumber.set(event.pageNumber);
    this.pageSize.set(event.pageSize);
    this.fetchMembers();
  }
}
