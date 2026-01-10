import { Photo } from '../../member.model';

export interface BatchPhotoUploadResponseDto {
  photos: Photo[];
  totalUploaded: number;
  totalFailed: number;
  errors: string[] | null;
}
