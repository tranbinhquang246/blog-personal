import { RoleTypes } from '@app/_constants/enums';

export interface User {
  id: string;
  username: string;
  email: string;
  role: RoleTypes;
  createdAt: string;
  updatedAt: string;
  profile: ProfileUser;
}

export interface ProfileUser {
  avatar: string;
  firstName: string;
  lastName: string;
  userId: string;
}
