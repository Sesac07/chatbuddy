'use client';
import Link from 'next/link';

function AuthButton() {
  return (
    <Link href="/api/auth/signin" className="px-2 font-bold text-[#87b8ad]">
      로그인
    </Link>
  );
}

export default AuthButton;
