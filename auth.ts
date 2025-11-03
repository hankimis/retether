import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
    }),
  ],
});


