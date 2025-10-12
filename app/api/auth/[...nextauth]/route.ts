import { User } from "@prisma/client";
import { v4 as uuid } from "uuid";
import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/models/login-schema";
import { encode as defaultEncode } from "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      role?: string | null;
      id?: string;
      active?: boolean;
      stripeCustomerId?: string | null;
    };
  }
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

const adapter = PrismaAdapter(prisma);

const handler = NextAuth({
  secret: process.env.AUTH_SECRET!,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // validate credentials using Zod schema
        const validatedCredentials = loginSchema.parse(credentials);

        const user = await prisma.user.findFirst({
          where: {
            email: validatedCredentials.email,
          },
        });

        console.log("Usuário encontrado: ", user);

        if (!user) {
          throw new Error("Usuário ou senha inválido.");
        }

        if (!user?.passwordHash) {
          throw new Error("Usuário ou senha inválido.");
        }

        const isValidPassword = await verifyPassword(
          validatedCredentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          throw new Error("Hash de senha inválido.");
        }

        if (!user?.active) {
          throw new Error("Usuário inativo.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session, user }) {
      if (session?.user && user) {
        session.user.role = (user as unknown as User).role;
        session.user.id = (user as unknown as User).id;
        session.user.active = (user as unknown as User).active;
        session.user.stripeCustomerId = (
          user as unknown as User
        ).stripeCustomerId;
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // valid for 1 day
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    // error: "/login", // Error code passed in query string as ?error=
    // verifyRequest: "/login", // (used for check email message)
  },
});

export { handler as GET, handler as POST };
