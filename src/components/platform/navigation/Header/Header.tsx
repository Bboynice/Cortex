'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/src/store/useAuthStore';
import ThemeToggle from '@/src/components/ui/ThemeToogle';

const Header = () => {
  const pathname = usePathname();
  const isAccountActive = pathname.startsWith('/settings');

  const navLinks = [
    { name: 'Cortex', href: '/dashboard' },
    { name: 'Playground', href: '/playground' },
    { name: 'Contact', href: '/contact' },
  ];

  const { user, status } = useAuthStore();

  return (
    <header className="fixed top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-fit px-4 select-none">
      <div className="pointer-events-auto relative group">
        
        {/* 1. THE AURORA GLOW (Behind the glass) */}
        {/* Fixed brand tint — not theme tokens — so header looks identical in light/dark */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(17_84%_49%/0.2)] via-[hsl(17_84%_49%/0.15)] to-[hsl(17_84%_49%/0.2)] blur-xl opacity-50 transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />

        {/* 2. THE MAIN GLASS BODY */}
        <div className="relative h-14 flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-2 shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* 3. LIGHT SWEEP EFFECT (The "AI" look) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

          <nav className="flex items-stretch gap-1 px-2">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-lg ${isActive ? "text-white" : "text-white/55 hover:text-white"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Separator Line */}
          <div className="h-4 w-px bg-white/10 mx-2" />

          <div className="flex items-stretch gap-1 px-2">
            {status !== 'authenticated' && (
              <Link 
              href="/login" 
              className="flex items-center px-4 py-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
            >
              Log In
            </Link>
            )}
            <Link 
              href="/settings" 
              className={`relative flex items-center px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-lg ${isAccountActive ? "text-white" : "text-white/55 hover:text-white"}`}
            >
              {isAccountActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Account</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;