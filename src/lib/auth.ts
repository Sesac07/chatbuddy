import { prisma } from '@/lib/prisma';
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

interface CustomJWT {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any; // 나머지 필드
}

export const { handlers, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },

  // JWT 설정
  jwt: {
    maxAge: 60 * 60,
  },

  // 이벤트 핸들러
  events: {
    async signIn({ user, account, profile }) {},
    async signOut() {},
  },

  // 콜백 함수들
  callbacks: {
    // 로그인 허용 여부 결정 및 DB 저장
    async signIn({ user, account }) {
      if (!account) return false;

      try {
        // 사용자 정보를 DB에 저장하거나 업데이트
        await prisma.users.upsert({
          where: {
            oauth_provider_oauth_id: {
              oauth_provider: account.provider,
              oauth_id: account.providerAccountId,
            },
          },
          update: {
            email: user.email,
            nickname: user.name,
            profile_image: user.image,
            last_login_at: new Date(),
          },
          create: {
            oauth_provider: account.provider,
            oauth_id: account.providerAccountId,
            email: user.email,
            nickname: user.name,
            profile_image: user.image,
            last_login_at: new Date(),
          },
        });

        return true;
      } catch (error) {
        console.error('사용자 정보 저장 실패:', error);
        return false;
      }
    },

    // JWT 토큰 생성/업데이트 시 실행
    async jwt({ token, user, account }) {
      // OAuth 로그인 시 사용자 정보를 토큰에 추가
      const customToken = token as CustomJWT;
      if (customToken && account) {
        customToken.accessToken = account.access_token;
        customToken.refreshToken = account.refresh_token;

        // DB에서 실제 user_id 조회
        const dbUser = await prisma.users.findUnique({
          where: {
            oauth_provider_oauth_id: {
              oauth_provider: account.provider,
              oauth_id: account.providerAccountId,
            },
          },
          select: {
            user_id: true,
          },
        });

        if (dbUser) {
          customToken.id = dbUser.user_id.toString();
        }
      }
      return customToken;
    },

    async session({ session, token }) {
      // JWT의 정보를 세션 객체에 추가
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },

  // 인증 프로바이더 설정
  providers: [Google, Kakao, Naver, Github],
  pages: {
    signIn: '/login',
  },
  //secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development',
});
