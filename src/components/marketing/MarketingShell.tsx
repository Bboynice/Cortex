'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/src/components/ui/ThemeToogle";
import { useAuthStore } from "@/src/store/useAuthStore";

type MarketingShellProps = {
  children: ReactNode;
};

const navLinks = [
  // Use `/` not `/#features` — hash navigation scrolls mid-page; other tabs load at top.
  { href: "/", label: "Features", match: "/" },
  { href: "/pricing", label: "Pricing", match: "/pricing" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/privacy", label: "Privacy", match: "/privacy" },
];

export default function MarketingShell({ children }: MarketingShellProps) {
  const pathname = usePathname();
  const { user, status } = useAuthStore();

  const isAuthenticated = status === "authenticated";

  return (
    <div className="min-h-screen w-full dark:bg-cortex-aura dark:text-content">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 sm:px-6">
        <header className="sticky top-0 z-30 pt-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg px-4 py-3 shadow-sm">
            <Link href="/" className="text-base font-semibold dark:text-content">
              Cortex
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.match;
                const scrollHomeToTop = link.href === "/" && pathname === "/";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={
                      scrollHomeToTop
                        ? (e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        : undefined
                    }
                    className={[
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "dark:text-content dark:bg-muted/30"
                        : "dark:text-muted-foreground dark:hover:text-content",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center rounded-md dark:bg-primary px-4 py-2 text-sm font-semibold dark:text-primary-foreground hover:brightness-110 active:brightness-95 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-md dark:bg-primary px-4 py-2 text-sm font-semibold dark:text-primary-foreground hover:brightness-110 active:brightness-95 transition"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 pb-10">
          {children}
        </main>

        <footer className="border-t dark:border-border py-6 text-sm dark:text-muted-foreground">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="dark:text-content">© {new Date().getFullYear()} Cortex</div>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/pricing" className="dark:hover:text-content transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="dark:hover:text-content transition-colors">
                About
              </Link>
              <Link href="/privacy" className="dark:hover:text-content transition-colors">
                Privacy
              </Link>
              <Link href="/dashboard" className="dark:hover:text-content transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
