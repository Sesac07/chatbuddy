import Image from 'next/image';
import Link from 'next/link';
import AuthButton from './auth-button';
function Header() {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-2">
      <Link href="/" className="flex items-center">
        <Image src="/logo.png" alt="ChatBuddy 로고" className="mr-2" width={40} height={40} />
        <h1 className="text-xl font-bold text-[#92c6bb]">ChatBuddy</h1>
      </Link>
      <AuthButton />
    </header>
  );
}

export default Header;
