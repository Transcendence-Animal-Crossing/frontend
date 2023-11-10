import NextAuth from 'next-auth';

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
}
