import api from '@/app/_base/api';
import { apiRouters } from '@/app/_constants/routers';
import { User } from '@/app/_types';
import { decodeToken } from '@/app/_utils';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'sign-in',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: async (credentials) => {
        try {
          const response = await api.post(apiRouters.LOGIN, credentials);
          const { data } = response;
          return Promise.resolve(data);
        } catch (error) {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt(params) {
      const { token, trigger, session } = params;
      const user = params.user as unknown as any;
      if (trigger === 'update' && session && token) {
        if (session.email) {
          (token.user as any).email = session.email;
        }
        if (session.username) {
          (token.user as any).name = session.username;
        }
        if (session.role) {
          (token.user as any).role_id = session.role;
        }
      }
      if (user) {
        token.user = user;
      }
      if (user?.access_token) {
        token.user = user;
        token.access_token = user.access_token;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token.user as User;
      session.access_token = token.access_token as string;
      const decodedToken = decodeToken(session.access_token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      session.expires = expirationDate.toISOString();
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  theme: {
    colorScheme: 'light',
  },
  session: {
    strategy: 'jwt',
  },
};
