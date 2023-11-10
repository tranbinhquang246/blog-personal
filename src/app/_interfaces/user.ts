import { RoleTypes } from '@app/_constants/enums';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: RoleTypes;
  access_token?: string;
}
