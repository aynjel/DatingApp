import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export interface AboutData {
  description?: string;
  interests?: string[];
}

@Component({
  selector: 'app-profile-about',
  imports: [CommonModule],
  templateUrl: './profile-about.component.html',
})
export class ProfileAboutComponent {
  aboutData = input<AboutData>();
}
