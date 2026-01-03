import { PaginationParams } from '../../common-models';

export interface GetMemberRequest {
  pagination?: PaginationParams;
  searchTerm?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  city?: string;
  country?: string;
}
