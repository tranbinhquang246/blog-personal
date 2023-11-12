import { RoleTypes } from '@app/_constants/enums';

export interface User {
  id: number;
  username: string;
  email: string;
  role: RoleTypes;
  profile: ProfileUser;
}

export interface ProfileUser {
  avatar: string;
  firstName: string;
  lastName: string;
  userId: string;
}
