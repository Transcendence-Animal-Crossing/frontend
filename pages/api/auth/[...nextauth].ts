import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';
import axios from 'axios';

const invalidPrimaryCampus = (profile: any) => {
  const campusId = profile.campus_users.find((cu: any) => cu.is_primary)?.campus_id;

  return campusId?.toString() !== process.env.CAMPUS_ID;
};

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FT_UID,
      clientSecret: process.env.FT_SECRET,
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],

  callbacks: {
    async signIn({ profile, user }) {
      if (!profile || !user) return false;
      if (invalidPrimaryCampus(profile)) return false;
      return user;
    },
    async jwt({ token, profile, account }) {
      if (profile && account) {
        token.user_id = profile.id;
        token.login = profile.login;
        try {
          const apiUrl = 'http://localhost:8080/auth/login';
          const response = await axios.post(apiUrl, {
            accessToken: account.access_token,
          });
          token.accessToken = response.headers.authorization.replace('Bearer ', '');
          console.log(response);
        } catch (error) {
          console.error('jwt error:', error);
          token.accessToken = 'fail';
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.login = token.login;
      session.user.user_id = token.user_id;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
