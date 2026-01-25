import { Member } from './member.model';

export type User = {
  userId: string;
  displayName: string;
  email: string;
  imageUrl?: string;
  memberDetails?: Member;
};

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

export interface JWTTokenModel {
  nameid: string[];
  role: string[] | string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}
