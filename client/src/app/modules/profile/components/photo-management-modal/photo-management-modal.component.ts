import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Input,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  AlertCircle,
  LucideAngularModule,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from 'lucide-angular';
import { Photo } from '../../../../shared/models/member.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { PreviewFile } from '../../models/photo.models';

@Component({
  selector: 'app-photo-management-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './photo-management-modal.component.html',
})
export class PhotoManagementModalComponent implements OnDestroy {
  private toasterService = inject(ToastService);

  @Input() photos: Photo[] = [];
  @Input() deletePhotoClicked: (photoId: string) => void = () => {};
  @Input() uploadPhotosClicked: (files: File[]) => void = () => {};
  @Input() onUploadComplete?: () => void;
  @Input() onUploadError?: () => void;

  activeTab = signal<'upload' | 'manage'>('manage');
  selectedFiles = signal<PreviewFile[]>([]);
  isUploading = signal(false);
  uploadProgress = signal(0);

  readonly trashIcon = Trash2Icon;
  readonly alertIcon = AlertCircle;
  readonly uploadIcon = UploadIcon;
  readonly xIcon = XIcon;

  private readonly MAX_PHOTOS = 10;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Reset upload state when switching tabs
    effect(() => {
      const tab = this.activeTab();
      if (tab === 'manage' && this.isUploading()) {
        this.resetUploadState();
      }
    });
  }

  openDeleteConfirm(photoId: string): void {
    this.deletePhotoClicked(photoId);
  }

  get availableSlots(): number {
    const existingCount = this.photos.length;
    return Math.max(0, this.MAX_PHOTOS - existingCount);
  }

  get canSelectMore(): boolean {
    return this.selectedFiles().length < this.availableSlots;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const remainingSlots = this.availableSlots - this.selectedFiles().length;
    if (remainingSlots <= 0) {
      this.toasterService.show(
        `You can only upload up to ${this.MAX_PHOTOS} photos.`,
        'error'
      );
      input.value = '';
      return;
    }

    const filesToProcess = Array.from(input.files).slice(0, remainingSlots);
    const newFiles: PreviewFile[] = [];
    let processedCount = 0;

    filesToProcess.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toasterService.show(
          `File ${file.name} is not a valid image.`,
          'error'
        );
        processedCount++;
        if (processedCount === filesToProcess.length && newFiles.length > 0) {
          this.selectedFiles.update((current) => [...current, ...newFiles]);
        }
        return;
      }

      // Validate file size
      if (file.size > this.MAX_FILE_SIZE) {
        this.toasterService.show(
          `File ${file.name} exceeds the maximum size of 5MB.`,
          'error'
        );
        processedCount++;
        if (processedCount === filesToProcess.length && newFiles.length > 0) {
          this.selectedFiles.update((current) => [...current, ...newFiles]);
        }
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        newFiles.push({ file, previewUrl });
        processedCount++;

        // Update signal when all files are processed
        if (processedCount === filesToProcess.length) {
          this.selectedFiles.update((current) => [...current, ...newFiles]);
        }
      };
      reader.onerror = () => {
        processedCount++;
        alert(`Failed to load preview for ${file.name}`);
        if (processedCount === filesToProcess.length && newFiles.length > 0) {
          this.selectedFiles.update((current) => [...current, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.update((files) => {
      const updated = [...files];
      updated.splice(index, 1);
      return updated;
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'photoFileInput'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  uploadPhotos(): void {
    const files = this.selectedFiles().map((pf) => pf.file);
    if (files.length === 0 || this.isUploading()) return;

    // Clear any existing interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    // Simulate progress (you can enhance this with actual upload progress tracking)
    this.progressInterval = setInterval(() => {
      this.uploadProgress.update((p) => {
        if (p >= 90) {
          return 90; // Stay at 90% until actual completion
        }
        return p + 10;
      });
    }, 300);

    try {
      // Call the upload callback - the parent handles the actual upload
      this.uploadPhotosClicked(files);

      // Note: The parent component will close the modal on success, which will
      // automatically reset the component state. If upload fails, the user can
      // try again. The progress will stay at 90% until the modal is closed or reset.
    } catch (error) {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      this.isUploading.set(false);
      this.uploadProgress.set(0);
      this.onUploadError?.();
    }
  }

  resetUploadState(): void {
    // Clear progress interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    this.selectedFiles().forEach((pf) => {
      // Clean up data URLs (FileReader results don't need revoke, but good practice)
      if (pf.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pf.previewUrl);
      }
    });
    this.selectedFiles.set([]);
    this.isUploading.set(false);
    this.uploadProgress.set(0);
  }

  ngOnDestroy(): void {
    // Clean up on component destroy
    this.resetUploadState();
  }
}
