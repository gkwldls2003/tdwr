import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      info?: { [key: string]: any };
    } & DefaultSession['user']
  }
}