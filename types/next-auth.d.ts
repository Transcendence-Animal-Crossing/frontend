import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      login: string;
      email: string;
      user_id: number;
    };
  }
}
