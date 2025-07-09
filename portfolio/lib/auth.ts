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
      const githubProfile = profile as { login?: string };
      return githubProfile?.login === process.env.GITHUB_ADMIN_USERNAME;
    },
    async jwt({ token, profile }) {
      const githubProfile = profile as { login?: string };
      if (githubProfile?.login) token.login = githubProfile.login;
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.login) {
        (session.user as { login?: string }).login = token.login as string;
      }
      return session;
    },
  },
};
