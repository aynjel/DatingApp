import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AlertComponent } from '@component/alert/alert.component';
import { LucideAngularModule, SparklesIcon } from 'lucide-angular';
import { PeopleStore } from '../../../people/store/people.store';
import { MatchCardStackComponent } from '../../components/match-card-stack/match-card-stack.component';

@Component({
  selector: 'app-matches',
  imports: [
    CommonModule,
    LucideAngularModule,
    MatchCardStackComponent,
    AlertComponent,
  ],
  templateUrl: './matches.component.html',
})
export class MatchesComponent implements OnInit {
  private peopleStore = inject(PeopleStore);

  members = computed(() => this.peopleStore.members());
  isInitialLoad = signal(true);

  // Card stack management
  currentIndex = signal(0);
  swipedCards = signal<Set<string>>(new Set());
  swipeDirection = signal<'left' | 'right' | null>(null);
  isAnimating = signal(false);

  // Icons
  readonly sparklesIcon = SparklesIcon;

  currentMember = computed(() => {
    const members = this.members();
    const index = this.currentIndex();
    return members[index] || null;
  });

  upcomingMembers = computed(() => {
    return this.members().slice(
      this.currentIndex() + 1,
      this.currentIndex() + 4
    );
  });

  remainingMembers = computed(() => {
    return this.members().length - this.currentIndex();
  });

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isInitialLoad.set(true);
    this.peopleStore.getMembers({
      pagination: {
        pageNumber: 1,
        pageSize: 20,
      },
      searchTerm: '',
    });
    // Mark as loaded once members are available
    const checkMembers = () => {
      if (this.members().length > 0) {
        this.isInitialLoad.set(false);
      } else {
        setTimeout(checkMembers, 100);
      }
    };
    setTimeout(checkMembers, 100);
  }

  onLike(): void {
    if (this.isAnimating() || !this.currentMember()) return;
    this.swipeCard('right');
  }

  onPass(): void {
    if (this.isAnimating() || !this.currentMember()) return;
    this.swipeCard('left');
  }

  swipeCard(direction: 'left' | 'right'): void {
    const member = this.currentMember();
    if (!member) return;

    this.isAnimating.set(true);
    this.swipeDirection.set(direction);

    // Mark as swiped
    const swiped = new Set(this.swipedCards());
    swiped.add(member.id);
    this.swipedCards.set(swiped);

    // Move to next card after animation
    setTimeout(() => {
      this.currentIndex.update((idx) => idx + 1);
      this.swipeDirection.set(null);
      this.isAnimating.set(false);

      // Load more if needed
      if (this.currentIndex() >= this.members().length - 3) {
        this.loadMoreMembers();
      }
    }, 300);
  }

  loadMoreMembers(): void {
    const pagination = this.peopleStore.pagination();
    if (pagination.currentPage < pagination.totalPages) {
      this.peopleStore.getMembers({
        pagination: {
          pageNumber: pagination.currentPage + 1,
          pageSize: 20,
        },
        searchTerm: '',
      });
    }
  }

  resetStack(): void {
    this.currentIndex.set(0);
    this.swipedCards.set(new Set());
    this.swipeDirection.set(null);
  }
}
