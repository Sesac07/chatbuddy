/**
 * NextAuth.js API 라우트 핸들러
 *
 * 이 파일은 NextAuth.js의 모든 인증 관련 API 엔드포인트를 처리합니다.
 *
 * 주요 역할:
 * 1. 인증 프로바이더(OAuth, Credentials 등)와의 통신 처리
 * 2. 로그인/로그아웃 요청 처리
 * 3. 세션 관리 및 JWT 토큰 처리
 * 4. 콜백 URL 처리 (OAuth 인증 후 리다이렉트)
 * 5. CSRF 보호 및 보안 검증
 
 */

import { handlers } from '@/lib/auth';

// NextAuth.js의 모든 HTTP 메서드(GET, POST)를 처리
export const { GET, POST } = handlers;
