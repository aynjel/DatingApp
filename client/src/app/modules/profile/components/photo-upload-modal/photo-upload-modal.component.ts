import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { CheckIcon, LucideAngularModule, UploadIcon } from 'lucide-angular';
import { Photo } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-photo-upload-modal',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './photo-upload-modal.component.html',
})
export class PhotoUploadModalComponent {
  @Input() existingPhotos: Photo[] = [];

  @Input() photoSelected: (file: File) => void = () => {};
  @Input() existingPhotoSelected: (photo: Photo) => void = () => {};

  readonly uploadIcon = UploadIcon;
  readonly checkIcon = CheckIcon;

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  activeTab = signal<'upload' | 'select'>('upload');
  selectedExistingPhoto = signal<Photo | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      this.selectedFile.set(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onUpload(): void {
    if (this.selectedFile()) {
      this.photoSelected(this.selectedFile()!);
      this.closeModal();
    }
  }

  onSelectExistingPhoto(photo: Photo): void {
    if (!photo.isMain) {
      this.selectedExistingPhoto.set(photo);
    }
  }

  onConfirmExistingPhoto(): void {
    if (this.selectedExistingPhoto()) {
      this.existingPhotoSelected(this.selectedExistingPhoto()!);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.selectedExistingPhoto.set(null);
    this.activeTab.set('upload');
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
}
