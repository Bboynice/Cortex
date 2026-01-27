import Link from 'next/link';

const Header = () => {
    return (
    <header className="bg-white dark:bg-gray-800 w-full h-32 flex justify-center items-center">
      <div className="container flex items-center w-full h-full">
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">Home</Link>
          <Link href="/dashboard/playground">Playground</Link>
          <Link href="/dashboard/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;