import { UserRoles } from './../models/user.model';

export const AvailableUserRoles: { [key: string]: UserRoles } = {
  Member: 'Member',
  Admin: 'Admin',
  Moderator: 'Moderator',
};
