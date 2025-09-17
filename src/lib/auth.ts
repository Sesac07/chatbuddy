import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
declare module 'next-auth' {
  interface Session {
    accessToken?: string; // OAuth 액세스 토큰
  }
}

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//     accessToken?: string;
//     refreshToken?: string;
//   }
// }

export const { handlers, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30분
  },

  // JWT 설정
  jwt: {
    maxAge: 30 * 60, // 30분
  },

  // 이벤트 핸들러
  events: {
    async signIn({ user, account, profile }) {
      console.log('signIn:', user.email);
    },
    async signOut() {
      console.log('로그아웃');
    },
  },

  // 콜백 함수들
  callbacks: {
    // JWT 토큰 생성/업데이트 시 실행
    async jwt({ token, user, account }) {
      // OAuth 로그인 시 사용자 정보를 토큰에 추가
      if (account && user) {
        console.log('jwt:', account.access_token);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = user.id;
      }
      return token;
    },

    // 세션 생성 시 실행
    async session({ session, token }) {
      // JWT 토큰의 정보를 세션에 추가
      if (token) {
        session.user.id = token.id as string;
        // ✅ 타입 확장 후 정상 작동
        session.accessToken = token.accessToken as string;
      }
      return session;
    },

    // 로그인 허용 여부 결정
    async signIn({ user, account, profile, email, credentials }) {
      console.log('로그인 성공 콜백 ', user, account, profile, email, credentials);
      return true;
    },

    // 리다이렉트 경로 커스터마이징
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - url:', url, 'baseUrl:', baseUrl);

      // 기본적으로 홈페이지로 리다이렉트
      return `${baseUrl}/`;
    },
  },

  // 인증 프로바이더 설정
  providers: [Google, Kakao, Naver, Github],
  pages: {
    signIn: '/login',
    // error: '/auth/error', // 에러 페이지 경로
  },

  // secret: process.env.NEXTAUTH_SECRET,

  // debug: process.env.NODE_ENV === 'development',
});
