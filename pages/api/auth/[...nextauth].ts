import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";

const invalidPrimaryCampus = (profile: any) => {
  const campusId = profile.campus_users.find(
    (cu: any) => cu.is_primary
  )?.campus_id;

  return campusId?.toString() !== process.env.CAMPUS_ID;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_ACCESS_SECRET,
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
      // 서버 요청 예정
      return user;
    },
    async jwt({ token, profile, account }) {
      if (profile && account) {
        token.user_id = profile.id;
        token.login = profile.login;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.login = token.login;
      session.user.user_id = token.user_id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
