import NextAuth from 'next-auth';
import type { NextAuthOptions, Profile } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const invalidPrimaryCampus = (profile: any) => {
  const campusId = profile.campus_users.find(
    (cu: any) => cu.is_primary
  )?.campus_id;
  return campusId?.toString() !== process.env.CAMPUS_ID;
};

const apiUrl = 'http://localhost:8080';
// const apiUrl = 'http://backend:8080';

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
    CredentialsProvider({
      id: 'general',
      name: 'Credentials',
      credentials: {
        intraname: { label: 'Intraname', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        try {
          const response = await axios.post(apiUrl + '/auth/signIn', {
            intraName: credentials.intraname,
            password: credentials.password,
          });
          if (response.status === 200) {
            const accessToken = response.headers.authorization.replace(
              'Bearer ',
              ''
            );
            const refreshToken =
              response.headers['set-cookie']?.[0]?.match(
                /refreshToken=([^;]+)/
              )?.[1];
            return {
              id: response.data.id,
              nickName: response.data.nickName,
              intraName: response.data.intraName,
              avatar: response.data.avatar,
              responseCode: response.status,
              accessToken,
              refreshToken,
            } as any;
          }
        } catch (e: any) {
          console.error('Sign in error:', e);
          if (e.response.status == 403) {
            return `/login/twofactor/${credentials.intraname}`;
          }
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: 'two-factor',
      name: 'Two Factor',
      credentials: {
        intraname: { label: 'IntraName', type: 'text' },
        token: { label: 'Token', type: 'text' },
      },
      authorize: async (credentials: any) => {
        if (!credentials) return null;
        try {
          const apiUrl = 'http://localhost:8080/auth/email/token';
          const response = await axios.post(apiUrl, {
            intraName: credentials.intraName,
            token: credentials.token,
          });
          if (response.status == 200) {
            const accessToken = response.headers.authorization.replace(
              'Bearer ',
              ''
            );
            const refreshToken =
              response.headers['set-cookie']?.[0]?.match(
                /refreshToken=([^;]+)/
              )?.[1];
            return {
              id: response.data.id,
              nickName: response.data.nickName,
              intraName: response.data.intraName,
              avatar: response.data.avatar,
              responseCode: response.status,
              accessToken,
              refreshToken,
            } as any;
          }
        } catch (e) {
          console.error('Sign in error:', e);
          return `/login/twofactor/${credentials.intraName}`;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // @ts-ignore
    async signIn({ profile, user, account }) {
      if (!profile && !user) return false;
      if (!profile && user) return user;
      if (invalidPrimaryCampus(profile)) return false;
      if (profile && account) {
        try {
          const apiUrl = 'http://localhost:8080/auth/login';
          await axios.post(apiUrl, {
            accessToken: account.access_token,
          });
        } catch (error: any) {
          if (error.response.status == 403) {
            console.log('42 login two-factor', error);
            const intraName = error.response.data?.intraName;
            return intraName
              ? `/login/twofactor/${intraName}`
              : '/login/choice';
          }
        }
      }
      return user;
    },
    async jwt({ user, token, profile, account, trigger, session }) {
      if (trigger == 'update') {
        return {
          ...token,
          ...session.user,
        };
      }
      if (!profile && account?.type == 'credentials') {
        token.id = user.id;
        token.nickName = user.nickName;
        token.intraName = user.intraName;
        token.avatar = user.avatar;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.responseCode = 200;
        return token;
      }
      if (profile && account) {
        try {
          const response = await axios.post(apiUrl + '/auth/login', {
            accessToken: account.access_token,
          });
          if (response.status === 200 || response.status === 201) {
            token.accessToken = response.headers.authorization.replace(
              'Bearer ',
              ''
            );
            token.refreshToken =
              response.headers['set-cookie']?.[0]?.match(
                /refreshToken=([^;]+)/
              )?.[1];
            token.id = response.data.id;
            token.nickName = response.data.nickName;
            token.intraName = response.data.intraName;
            token.avatar = response.data.avatar;
            token.responseCode = response.status;
          }
        } catch (error) {
          console.error('jwt error:', error);
          token.accessToken = 'fail';
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as number;
      session.user.nickName = token.nickName as string;
      session.user.intraName = token.intraName as string;
      session.user.avatar = token.avatar as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.responseCode = token.responseCode as number;
      return session;
    },
  },
  pages: {
    signIn: '/login/general',
  },
};

export default NextAuth(authOptions);
