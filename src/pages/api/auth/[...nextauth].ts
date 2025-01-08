import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { insertLoginHistQuery, selectUserInfoQuery } from "../../../../common/querys/auth/page";
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

          params = [user.user_id, req.headers && req.headers['x-forwarded-for'], '01']

          //로그인 내역
          await insertLoginHistQuery(params);

          user = {
            user_id: user.user_id,
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
    maxAge: 60 * 60, // 세션시간 1시간
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,  // 쿠키를 자바스크립트에서 접근할 수 없도록 설정
        secure: process.env.NODE_ENV === "production", // HTTPS 환경에서만 사용
        sameSite: "lax",  // CSRF 공격 방지
        path: '/',
      },
    },
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/signout',
  },
};

export default NextAuth(authOptions);
