export interface Member {
  id: string;
  dateOfBirth: string;
  imageUrl: string;
  displayName: string;
  created: string;
  lastActive: string;
  gender: string;
  description: string;
  city: string;
  country: string;
  interests: string[];
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  publicId: string;
  member: string;
  memberId: string;
  isMain: boolean;
}

export class MemberParams {
  gender?: string;
  minAge = 18;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 10;
  orderBy = 'lastActive';
}
