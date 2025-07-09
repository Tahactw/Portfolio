// lib/auth.ts
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      // Optional: restrict login to a specific GitHub username
      return user.name?.toLowerCase() === process.env.GITHUB_ADMIN_USERNAME?.toLowerCase();
    },
  },
};
