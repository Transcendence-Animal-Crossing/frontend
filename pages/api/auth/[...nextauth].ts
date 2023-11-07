import NextAuth from 'next-auth';
import type { NextAuthOptions, Profile } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';
import axios from 'axios';

const invalidPrimaryCampus = (profile: any) => {
  const campusId = profile.campus_users.find((cu: any) => cu.is_primary)?.campus_id;

  return campusId?.toString() !== process.env.CAMPUS_ID;
};

interface CustomProfile extends Profile {
  id: string;
  login: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET as string,
  providers: [
    FortyTwoProvider({
      clientId: process.env.FT_UID as string,
      clientSecret: process.env.FT_SECRET as string,
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],

  callbacks: {
    // @ts-ignore
    async signIn({ profile, user }) {
      if (!profile || !user) return false;
      if (invalidPrimaryCampus(profile)) return false;
      return user;
    },
    async jwt({ token, profile, account }) {
      if (profile && account) {
        const customProfile = profile as CustomProfile;
        token.user_id = customProfile.id;
        token.login = customProfile.login;
        try {
          const apiUrl = 'http://localhost:8080/auth/login';
          const response = await axios.post(apiUrl, {
            accessToken: account.access_token,
          });
          token.accessToken = response.headers.authorization.replace('Bearer ', '');
          console.log(response);
          token.responseCode = response.status;
        } catch (error) {
          console.error('jwt error:', error);
          token.accessToken = 'fail';
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.login = token.login as string;
      session.user.user_id = token.user_id as number;
      session.accessToken = token.accessToken as string;
      session.responseCode = token.responseCode as number;
      return session;
    },
  },
};

export default NextAuth(authOptions);
