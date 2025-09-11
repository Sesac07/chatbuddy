import Header from '@/components/header';
import type { Metadata } from 'next';
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
  description: '고민 상담 서비스 입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex max-w-7xl flex-col bg-amber-300 px-2">
          <Header />
          <main>{children}</main>
          {/* <footer>footer 입니다.</footer> */}
        </div>
      </body>
    </html>
  );
}
