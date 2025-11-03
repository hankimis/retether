import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testPassword() {
  const email = process.argv[2] || "admin@retether.io";
  const password = process.argv[3] || "admin123";

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`❌ 사용자를 찾을 수 없습니다: ${email}`);
      return;
    }

    if (!user.password) {
      console.log(`❌ 비밀번호가 설정되지 않았습니다.`);
      return;
    }

    console.log(`테스트할 비밀번호: ${password}`);
    console.log(`저장된 해시: ${user.password.substring(0, 30)}...`);

    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log(`✅ 비밀번호가 일치합니다!`);
    } else {
      console.log(`❌ 비밀번호가 일치하지 않습니다.`);
      console.log(`\n새 비밀번호로 재설정 중...`);
      
      const newHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email },
        data: { password: newHash },
      });
      
      console.log(`✅ 비밀번호가 재설정되었습니다.`);
      
      // 다시 확인
      const recheck = await bcrypt.compare(password, newHash);
      console.log(`재확인: ${recheck ? "✅ 성공" : "❌ 실패"}`);
    }
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();

