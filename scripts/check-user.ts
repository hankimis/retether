import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function checkUser() {
  const email = process.argv[2] || "admin@retether.io";

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log(`❌ 사용자를 찾을 수 없습니다: ${email}`);
    } else {
      console.log(`✅ 사용자 정보:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   이메일: ${user.email}`);
      console.log(`   이름: ${user.name || "없음"}`);
      console.log(`   역할: ${user.role}`);
      console.log(`   비밀번호 설정: ${user.password ? "✅ 있음" : "❌ 없음"}`);
      console.log(`   생성일: ${user.createdAt}`);
      
      if (user.password) {
        console.log(`   비밀번호 해시: ${user.password.substring(0, 20)}...`);
      }
    }
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();

