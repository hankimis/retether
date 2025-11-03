import { prisma } from "./prisma";

/**
 * 데이터베이스 쿼리를 안전하게 실행합니다.
 * 프로덕션/개발 환경 모두에서 에러 발생 시 fallback 값을 반환합니다.
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    // Prisma Client가 제대로 초기화되었는지 확인
    if (!prisma) {
      console.error("❌ Prisma Client가 초기화되지 않았습니다.");
      return fallback;
    }
    
    return await queryFn();
  } catch (error: any) {
    // 모든 Prisma 에러 코드 처리
    const prismaErrorCodes = [
      "P1001", // Can't reach database server
      "P1002", // Database server doesn't accept connections
      "P1003", // Database does not exist
      "P1008", // Operations timed out
      "P1009", // Database already exists
      "P1010", // User was denied access
      "P1011", // TLS connection error
      "P1017", // Server has closed the connection
    ];
    
    const isPrismaError = error?.code && prismaErrorCodes.includes(error.code);
    const isConnectionError = 
      error?.message?.includes("Can't reach database server") ||
      error?.message?.includes("connect ECONNREFUSED") ||
      error?.message?.includes("connect ETIMEDOUT") ||
      error?.message?.includes("ECONNREFUSED") ||
      error?.message?.includes("Module not found") ||
      error?.message?.includes("Cannot find module");
    
    if (isPrismaError || isConnectionError) {
      console.error("❌ 데이터베이스 연결 오류:", {
        code: error?.code,
        message: error?.message,
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      });
      return fallback;
    }
    
    // 예상치 못한 에러도 프로덕션에서는 fallback 반환
    if (process.env.NODE_ENV === "production") {
      console.error("❌ 예상치 못한 데이터베이스 오류:", {
        code: error?.code,
        message: error?.message,
      });
      return fallback;
    }
    
    // 개발 환경에서는 에러를 throw하여 디버깅 가능하게
    throw error;
  }
}

