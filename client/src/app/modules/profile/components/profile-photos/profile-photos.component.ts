import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Photo } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-profile-photos',
  imports: [CommonModule],
  templateUrl: './profile-photos.component.html',
})
export class ProfilePhotosComponent {
  photos = input<Photo[]>([]);
}
