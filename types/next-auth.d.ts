import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    responseCode: number;
    user: {
      login: string;
      email: string;
      user_id: number;
    };
  }
}
