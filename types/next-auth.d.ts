import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: "USER" | "OPERATOR" | "ADMIN";
    };
  }

  interface User {
    role?: "USER" | "OPERATOR" | "ADMIN";
  }
}



