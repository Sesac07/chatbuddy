'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AuthButton() {
  const pathname = usePathname();
  console.log(pathname);
  if (pathname === '/login') {
    return null;
  }
  return (
    <Link href="/login" className="px-2 font-bold text-[#87b8ad]">
      로그인
    </Link>
  );
}

export default AuthButton;
