import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { insertLoginHistQuery, selectUserInfoQuery } from "../../../../../common/querys/auth/page";
import bcrypt from 'bcrypt';


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        login_id: { label: "login_id", type: "text" },
        passwd: { label: "passwd", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.login_id || !credentials.passwd) {
          return null;
        }

        let params = [credentials.login_id];
        let user = await selectUserInfoQuery(params);

        if (user && await bcrypt.compare(credentials.passwd, user.passwd)) {

          params = [user.login_id, req.headers?.['x-forwarded-for'], '01']

          //로그인 내역
          await insertLoginHistQuery(params);

          user = {
            id: user.id,
            user_nm: user.user_nm,
            author_id: user.author_id
          }
          return user;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.info = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = token;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 세샨시간 1시간
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/signout',
  },
};
