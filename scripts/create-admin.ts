import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = process.argv[2] || "admin@retether.io";
  const password = process.argv[3] || "admin123";
  const name = process.argv[4] || "Admin User";

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 기존 사용자 확인
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      // 기존 사용자를 ADMIN으로 업데이트하고 비밀번호 설정
      const updated = await prisma.user.update({
        where: { email },
        data: { 
          role: "ADMIN",
          password: hashedPassword,
        },
      });
      console.log(`✅ 기존 사용자를 ADMIN으로 업데이트했습니다:`);
      console.log(`   이메일: ${updated.email}`);
      console.log(`   이름: ${updated.name || "없음"}`);
      console.log(`   역할: ${updated.role}`);
      console.log(`   비밀번호: ${password}`);
    } else {
      // 새 사용자 생성
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "ADMIN",
        },
      });
      console.log(`✅ 어드민 계정이 생성되었습니다:`);
      console.log(`   이메일: ${user.email}`);
      console.log(`   이름: ${user.name}`);
      console.log(`   역할: ${user.role}`);
      console.log(`   비밀번호: ${password}`);
    }

    console.log(`\n🔐 로그인 정보:`);
    console.log(`   이메일: ${email}`);
    console.log(`   비밀번호: ${password}`);
    console.log(`\n📧 다음 단계:`);
    console.log(`   1. 브라우저에서 http://localhost:3000/auth/signin 접속`);
    console.log(`   2. 위의 이메일과 비밀번호로 로그인`);
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

