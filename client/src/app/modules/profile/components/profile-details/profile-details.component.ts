import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export interface DetailInfo {
  label: string;
  value: string;
}

@Component({
  selector: 'app-profile-details',
  imports: [CommonModule],
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent {
  details = input<DetailInfo[]>([]);
}
