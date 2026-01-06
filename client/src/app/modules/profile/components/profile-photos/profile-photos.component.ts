import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Photo } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-profile-photos',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './profile-photos.component.html',
})
export class ProfilePhotosComponent {
  photos = input<Photo[]>([]);
  openManagementClicked = output<void>();

  openPhotoManagement(): void {
    this.openManagementClicked.emit();
  }
}
