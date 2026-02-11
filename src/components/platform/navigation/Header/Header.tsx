import Link from 'next/link';

import NeonBorder from '@/src/components/ui/NeonBorder';

const Header = () => {
    return (
      <header className="relative overflow-hidden dark:bg-background dark:text-content w-full h-32 flex justify-center items-center">
      <div className="w-full h-full flex items-center px-6">
        <nav className="flex items-center gap-4">
          <div className=''>Cortex</div>
          <Link href="/dashboard">Home</Link>
          <Link href="/dashboard/playground">Playground</Link>
          <Link href="/dashboard/contact">Contact</Link>
        </nav>
      </div>


      <NeonBorder type="bottom" />
    </header>
  );
};

export default Header;