import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function verifyPassword() {
  const email = "admin@retether.io";

  try {
    // select를 명시적으로 사용하여 password 필드 포함
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true, // 명시적으로 선택
      },
    });

    if (!user) {
      console.log(`❌ 사용자를 찾을 수 없습니다: ${email}`);
      return;
    }

    console.log(`✅ 사용자 정보:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   이메일: ${user.email}`);
    console.log(`   이름: ${user.name || "없음"}`);
    console.log(`   역할: ${user.role}`);
    console.log(`   비밀번호 필드 값: ${user.password ? `✅ 설정됨 (${user.password.substring(0, 20)}...)` : "❌ NULL 또는 undefined"}`);
    
    if (!user.password) {
      console.log(`\n⚠️  비밀번호가 설정되지 않았습니다.`);
      console.log(`다시 설정 중...`);
      
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const updated = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
        select: { password: true },
      });
      
      console.log(`✅ 비밀번호가 설정되었습니다: ${updated.password ? "✅" : "❌"}`);
    }
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPassword();

