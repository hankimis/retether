import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import { authConfig } from "@/auth.config";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ 이메일 또는 비밀번호가 제공되지 않음");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              password: true, // 명시적으로 password 필드 선택
            },
          });

          if (!user) {
            console.log(`❌ 사용자를 찾을 수 없음: ${credentials.email}`);
            return null;
          }

          if (!user.password) {
            console.log(`❌ 비밀번호가 설정되지 않음: ${credentials.email}`);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log(`❌ 비밀번호 불일치: ${credentials.email}`);
            return null;
          }

          console.log(`✅ 로그인 성공: ${user.email}, 역할: ${user.role}`);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("❌ authorize 오류:", error);
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };


