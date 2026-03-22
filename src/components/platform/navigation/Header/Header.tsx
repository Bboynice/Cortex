import Link from 'next/link';

import NeonBorder from '@/src/components/ui/NeonBorder';

const Header = () => {
    return (
      <header className="relative overflow-hidden dark:bg-background dark:text-content w-full h-32 flex justify-center items-center border-b-1 dark:border-accent">
      <div className="w-full h-full flex items-center px-6 justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">Cortex</Link>
          <Link href="/dashboard">Playground</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/settings">Account</Link>
        </div>
      </div>
      <NeonBorder />


    </header>
  );
};

export default Header;