import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { checkRateLimit } from '../rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // 시간을 제어 가능하도록 설정
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 각 테스트 후 Mock 상태 초기화
    vi.restoreAllMocks();
  });

  /**
   * 헬퍼 함수: N번 요청을 실행
   */
  const makeRequests = (userId: string, count: number, maxRequests?: number, windowMs?: number) => {
    for (let i = 0; i < count; i++) {
      checkRateLimit(userId, maxRequests, windowMs);
    }
  };

  describe('기본 동작', () => {
    it('첫 요청은 항상 허용해야 한다', () => {
      // Arrange: 새로운 사용자 ID 준비
      const userId = 'user-1';

      // Act: 첫 번째 요청 실행
      const result = checkRateLimit(userId);

      // Assert: 요청이 허용되어야 함
      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it('제한 이내의 요청은 모두 허용해야 한다', () => {
      // Arrange: 사용자 ID와 최대 요청 수 설정
      const userId = 'user-2';
      const maxRequests = 5;

      // Act & Assert: maxRequests만큼 연속 요청
      for (let i = 0; i < maxRequests; i++) {
        const result = checkRateLimit(userId, maxRequests);
        expect(result.allowed).toBe(true);
      }
    });

    it('제한을 초과한 요청은 차단해야 한다', () => {
      // Arrange: 사용자가 이미 최대 요청 수에 도달
      const userId = 'user-3';
      const maxRequests = 3;

      // maxRequests만큼 요청하여 제한에 도달
      makeRequests(userId, maxRequests, maxRequests);

      // Act: 제한을 초과하는 요청 실행
      const result = checkRateLimit(userId, maxRequests);

      // Assert: 요청이 차단되어야 하고 retryAfter가 제공되어야 함
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeDefined();
      expect(result.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('시간 윈도우 관리', () => {
    it('시간 윈도우가 만료되면 카운터가 리셋되어야 한다', () => {
      // Arrange: 사용자가 제한에 도달한 상태
      const userId = 'user-4';
      const maxRequests = 3;
      const windowMs = 60000; // 1분

      makeRequests(userId, maxRequests, maxRequests, windowMs);

      const blockedResult = checkRateLimit(userId, maxRequests, windowMs);
      expect(blockedResult.allowed).toBe(false);

      // Act: 시간 윈도우를 초과하여 시간 이동 (1분 + 1초)
      vi.advanceTimersByTime(windowMs + 1000);
      const result = checkRateLimit(userId, maxRequests, windowMs);

      // Assert: 카운터가 리셋되어 요청이 허용되어야 함
      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it('retryAfter는 남은 대기 시간을 초 단위로 반환해야 한다', () => {
      // Arrange: 사용자가 제한에 도달
      const userId = 'user-5';
      const maxRequests = 2;
      const windowMs = 60000; // 60초

      makeRequests(userId, maxRequests, maxRequests, windowMs);

      // Act: 5초 경과 후 제한 초과 요청
      vi.advanceTimersByTime(5000);
      const result = checkRateLimit(userId, maxRequests, windowMs);

      // Assert: 남은 대기 시간이 약 55초여야 함
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBe(55);
    });
  });

  describe('사용자 격리', () => {
    it('서로 다른 사용자의 제한은 독립적이어야 한다', () => {
      // Arrange: 두 명의 다른 사용자
      const user1 = 'user-6';
      const user2 = 'user-7';
      const maxRequests = 2;

      makeRequests(user1, maxRequests, maxRequests);
      const user1Blocked = checkRateLimit(user1, maxRequests);

      // Act: user2의 첫 요청 실행
      const user2Result = checkRateLimit(user2, maxRequests);

      // Assert: user1은 차단되지만 user2는 허용되어야 함
      expect(user1Blocked.allowed).toBe(false);
      expect(user2Result.allowed).toBe(true);
    });
  });

  describe('커스텀 설정', () => {
    it('커스텀 maxRequests를 존중해야 한다', () => {
      // Arrange: 커스텀 최대 요청 수 설정
      const userId = 'user-8';
      const customMaxRequests = 10;

      // Act & Assert: 커스텀 제한만큼 요청
      for (let i = 0; i < customMaxRequests; i++) {
        const result = checkRateLimit(userId, customMaxRequests);
        expect(result.allowed).toBe(true);
      }

      // 초과 요청은 차단
      const exceededResult = checkRateLimit(userId, customMaxRequests);
      expect(exceededResult.allowed).toBe(false);
    });

    it('커스텀 windowMs를 존중해야 한다', () => {
      // Arrange: 짧은 시간 윈도우 설정
      const userId = 'user-9';
      const maxRequests = 2;
      const customWindowMs = 5000; // 5초

      makeRequests(userId, maxRequests, maxRequests, customWindowMs);

      const blockedResult = checkRateLimit(userId, maxRequests, customWindowMs);
      expect(blockedResult.allowed).toBe(false);

      // Act: 커스텀 윈도우 경과 (5초 + 0.1초)
      vi.advanceTimersByTime(customWindowMs + 100);
      const result = checkRateLimit(userId, maxRequests, customWindowMs);

      // Assert: 리셋되어야 함
      expect(result.allowed).toBe(true);
    });
  });

  describe('엣지 케이스', () => {
    it('연속된 요청의 카운트가 올바르게 증가해야 한다', () => {
      // Arrange
      const userId = 'user-10';
      const maxRequests = 5;

      // Act: 4번 요청 (제한 직전)
      makeRequests(userId, 4, maxRequests);

      const fifthRequest = checkRateLimit(userId, maxRequests);
      const sixthRequest = checkRateLimit(userId, maxRequests);

      // Assert: 5번째는 허용, 6번째는 차단
      expect(fifthRequest.allowed).toBe(true);
      expect(sixthRequest.allowed).toBe(false);
    });

    it('시간이 정확히 resetAt과 같을 때 리셋되지 않아야 한다', () => {
      // Arrange
      const userId = 'user-11';
      const maxRequests = 1;
      const windowMs = 10000;

      // 첫 요청
      checkRateLimit(userId, maxRequests, windowMs);

      // Act: 정확히 windowMs만큼 이동 (초과 아님)
      vi.advanceTimersByTime(windowMs);

      // 두 번째 요청
      const result = checkRateLimit(userId, maxRequests, windowMs);

      // Assert: 아직 리셋되지 않아야 함 (now > resetAt이 아니므로)
      expect(result.allowed).toBe(false);
    });

    it('빈 userId 문자열도 처리할 수 있어야 한다', () => {
      // Arrange
      const userId = '';

      // Act
      const result = checkRateLimit(userId);

      // Assert: 정상 동작해야 함
      expect(result.allowed).toBe(true);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('API Rate Limiting 시뮬레이션: 1분당 10회 제한', () => {
      // Arrange: 실제 API 시나리오 (1분당 10회)
      const userId = 'api-user-1';
      const maxRequests = 10;
      const windowMs = 60000;

      // Act & Assert: 10회까지 성공
      for (let i = 0; i < maxRequests; i++) {
        const result = checkRateLimit(userId, maxRequests, windowMs);
        expect(result.allowed).toBe(true);
      }

      // 11번째 요청 차단
      const exceededResult = checkRateLimit(userId, maxRequests, windowMs);
      expect(exceededResult.allowed).toBe(false);
      expect(exceededResult.retryAfter).toBeGreaterThan(0);

      // 1분 경과 후 다시 허용
      vi.advanceTimersByTime(windowMs + 1000);
      const resetResult = checkRateLimit(userId, maxRequests, windowMs);
      expect(resetResult.allowed).toBe(true);
    });
  });
});
