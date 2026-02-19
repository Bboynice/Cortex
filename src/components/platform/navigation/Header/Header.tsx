import Link from 'next/link';

import NeonBorder from '@/src/components/ui/NeonBorder';

const Header = () => {
    return (
      <header className="relative overflow-hidden dark:bg-background dark:text-content w-full h-32 flex justify-center items-center border-b-1 dark:border-accent">
      <div className="w-full h-full flex items-center px-6">
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">Cortex</Link>
          <Link href="/dashboard">Playground</Link>
          <Link href="/dashboard/contact">Contact</Link>
        </nav>
      </div>


    </header>
  );
};

export default Header;