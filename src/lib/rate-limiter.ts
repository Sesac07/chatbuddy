// 간단한 메모리 기반 Rate Limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>();

const MINUTE = 60 * 1000; // 60초

export function checkRateLimit(
  userId: string,
  maxRequests: number = 10,
  windowMs: number = MINUTE,
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userRecord = requestCounts.get(userId);

  // 시간 윈도우 초과 또는 첫 요청
  if (!userRecord || now > userRecord.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  // 제한 초과
  if (userRecord.count >= maxRequests) {
    const retryAfter = Math.ceil((userRecord.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // 카운트 증가
  userRecord.count++;
  return { allowed: true };
}
