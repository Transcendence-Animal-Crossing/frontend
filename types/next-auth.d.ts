import NextAuth from 'next-auth';
import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    responseCode: number;
    user: {
      id: number;
      nickName: string;
      intraName: string;
      avatar: string;
    };
  }
  interface User extends DefaultUser {
    id: number;
    nickName: string;
    intraName: string;
    avatar: string;
    responseCode: number;
    accessToken: string;
    refreshToken: string;
  }
}
