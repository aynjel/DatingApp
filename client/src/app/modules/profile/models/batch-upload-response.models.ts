import { Photo } from '../../../shared/models/member.model';

export interface BatchUploadResponse {
  photos: Photo[];
  totalUploaded: number;
  totalFailed: number;
  errors: string[];
}
