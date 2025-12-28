import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PeopleStore } from '../../store/people.store';

@Component({
  selector: 'app-lists',
  imports: [
    LucideAngularModule,
    AvatarComponent,
    PaginationComponent,
    RouterLink,
  ],
  templateUrl: './lists.component.html',
})
export class ListsComponent implements OnInit {
  private peopleStore = inject(PeopleStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly chevronLeftIcon = ChevronLeftIcon;
  readonly chevronRightIcon = ChevronRightIcon;

  members = computed(() => this.peopleStore.members());
  pagination = computed(() => this.peopleStore.pagination());

  pageNumber = signal(1);
  pageSize = signal(10);

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
        : this.peopleStore.pagination().itemsPerPage;

      this.pageNumber.set(pageNumber);
      this.pageSize.set(pageSize);
      this.fetchMembers();
    });
  }

  private fetchMembers(): void {
    this.peopleStore.getMembers({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    });
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

  calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}
