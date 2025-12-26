import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, map, of } from 'rxjs';
import { Member } from '../../../shared/models/member.model';
import { MemberService } from '../services/member.service';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  console.log('memberResolver');
  const memberService = inject(MemberService);
  const router = inject(Router);

  const userId = route.paramMap.get('id');

  if (!userId) {
    console.error('User ID is required');
    return EMPTY;
  }

  return memberService.getMemberById(userId).pipe(
    map((member: Member) => member),
    catchError(() => {
      return of(new RedirectCommand(router.parseUrl('/messages/inbox')));
    })
  );
};
