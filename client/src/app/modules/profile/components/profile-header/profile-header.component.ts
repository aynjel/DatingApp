import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CameraIcon,
  LogOutIcon,
  LucideAngularModule,
  PencilIcon,
} from 'lucide-angular';
import { AvatarComponent } from 'ngx-avatar-2';
import { Member } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-profile-header',
  imports: [RouterLink, DatePipe, LucideAngularModule, AvatarComponent],
  templateUrl: './profile-header.component.html',
})
export class ProfileHeaderComponent {
  memberDetails = input<Member>();
  uploadPhotoClicked = output<void>();

  readonly editIcon = PencilIcon;
  readonly cameraIcon = CameraIcon;
  readonly logoutIcon = LogOutIcon;

  onUploadPhotoClick(): void {
    this.uploadPhotoClicked.emit();
  }
}
