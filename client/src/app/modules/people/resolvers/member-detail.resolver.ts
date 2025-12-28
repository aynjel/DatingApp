import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Member } from '../../../shared/models/member.model';
import { MemberService } from '../../../shared/services/member.service';

export const memberDetailResolver: ResolveFn<Member | null> = (
  route,
  state
) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');

  if (!memberId) {
    router.navigate(['/people/lists']);
    return of(null);
  }

  return memberService.getMemberById(memberId).pipe(
    catchError((error) => {
      console.error('Error loading member:', error);
      router.navigate(['/people/lists']);
      return of(null);
    })
  );
};
