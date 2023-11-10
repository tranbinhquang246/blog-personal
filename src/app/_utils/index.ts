import { JwtDecode } from '@app/_interfaces/auth';
import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token: string): JwtDecode => {
  return jwtDecode(token);
};
