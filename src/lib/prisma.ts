import { PrismaClient } from '@prisma/client';

// 싱글톤 패턴으로 관리
// 개발 환경에서 Hot Reload 시 연결이 누적되는 것을 방지

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
