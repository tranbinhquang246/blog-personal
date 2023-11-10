import NextAuth from 'next-auth';
import { User } from '@interfaces/user';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends Token {
    user: User;
    access_token: string;
  }
}
