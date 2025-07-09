import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile?.login === process.env.GITHUB_ADMIN_USERNAME;
    },
    async jwt({ token, profile }) {
      if (profile) token.login = profile.login;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.login = token.login as string;
      return session;
    },
  },
};