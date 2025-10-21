'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AuthButton() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (pathname === '/login' || status === 'loading') {
    return null;
  }
  return (
    <>
      {session ? (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="cursor-pointer px-2 font-bold text-[#87b8ad]">
          로그아웃
        </button>
      ) : (
        <Link href="/login" className="px-2 font-bold text-[#87b8ad]">
          로그인
        </Link>
      )}
    </>
  );
}

export default AuthButton;
