import Link from 'next/link';

import NeonBorder from '@/src/components/ui/NeonBorder';

const Header = () => {
    return (
      <header className="relative overflow-hidden bg-white dark:bg-gray-800 w-full h-32 flex justify-center items-center">
      <div className="container flex items-center w-full h-full">
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">Home</Link>
          <Link href="/dashboard/playground">Playground</Link>
          <Link href="/dashboard/contact">Contact</Link>
          <div className='bg-white round'>
            button
            <NeonBorder type="border"/>
          </div>
        </nav>
      </div>


      <NeonBorder />
    </header>
  );
};

export default Header;