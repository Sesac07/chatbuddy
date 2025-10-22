import Header from '@/components/header';
import { ModalProvider } from '@/components/modal-provider';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ChatBuddy',
  description: '성향에 맞는 상담 서비스 입니다.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        <SessionProvider>
          <ModalProvider>
            <div className="mx-auto flex max-w-7xl flex-col px-2">
              <Header />
              <main>{children}</main>
              {/* <footer>footer 입니다.</footer> */}
            </div>
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
