import { Component, Input } from '@angular/core';
import { AlertCircle, LucideAngularModule, Trash2Icon } from 'lucide-angular';
import { Photo } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-photo-management-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './photo-management-modal.component.html',
})
export class PhotoManagementModalComponent {
  @Input() photos: Photo[] = [];
  @Input() deletePhotoClicked: (photoId: string) => void = () => {};

  readonly trashIcon = Trash2Icon;
  readonly alertIcon = AlertCircle;

  openDeleteConfirm(photoId: string): void {
    this.deletePhotoClicked(photoId);
  }
}
