import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { selectUserInfoQuery } from "../../../../../common/querys/auth/page";
import bcrypt from 'bcrypt';


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        login_id: { label: "login_id", type: "text" },
        passwd: { label: "passwd", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.login_id || !credentials.passwd) {
          return null;
        }

        const params = [credentials.login_id];
        const user = await selectUserInfoQuery(params);

        if (user && await bcrypt.compare(credentials.passwd, user.passwd)) {
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
