import { prisma } from "./prisma";

/**
 * 데이터베이스 쿼리를 안전하게 실행합니다.
 * 개발 중 DB 연결 오류 시 빈 배열 또는 null을 반환합니다.
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await queryFn();
  } catch (error: any) {
    if (
      error?.code === "P1001" ||
      error?.message?.includes("Can't reach database server") ||
      error?.message?.includes("connect ECONNREFUSED")
    ) {
      console.warn("⚠️  데이터베이스 연결 오류. 개발 모드에서는 빈 데이터를 반환합니다.");
      console.warn("💡 .env 파일에 DATABASE_URL을 설정하거나 PostgreSQL을 실행하세요.");
      return fallback;
    }
    throw error;
  }
}

