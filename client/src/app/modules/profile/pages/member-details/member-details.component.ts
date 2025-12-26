import { Component, input } from '@angular/core';
import { Member } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-member-details',
  imports: [],
  templateUrl: './member-details.component.html',
})
export class MemberDetailsComponent {
  protected member = input.required<Member>();
}
