import { User } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      role?: string | null;
    };
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (
          credentials?.email === "mazzulli@live.com" &&
          credentials.password === "123"
        ) {
          return {
            id: "1",
            email: credentials.email,
            name: "Danilo",
            role: "Administrator",
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user) {
        session.user.role = (user as unknown as User).role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
