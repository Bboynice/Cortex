'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MarketingShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const navLinks = [
  { href: "/#features", label: "Features", match: "/" },
  { href: "/pricing", label: "Pricing", match: "/pricing" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/privacy", label: "Privacy", match: "/privacy" },
];

export default function MarketingShell({ children, title, description }: MarketingShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full dark:bg-cortex-aura dark:text-content">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6">
        <header className="sticky top-0 z-30 pt-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg px-4 py-3 shadow-sm">
            <Link href="/" className="text-base font-semibold dark:text-content">
              Cortex
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.match;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
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
              <Link
                href="/login"
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium dark:text-muted-foreground dark:hover:text-content transition-colors sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-md dark:bg-primary px-4 py-2 text-sm font-semibold dark:text-primary-foreground hover:brightness-110 active:brightness-95 transition"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 py-10">
          {title ? (
            <section className="mx-auto max-w-3xl py-8 text-center sm:py-12">
              <h1 className="text-4xl font-semibold tracking-tight dark:text-content sm:text-5xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 text-base leading-7 dark:text-muted-foreground sm:text-lg">
                  {description}
                </p>
              ) : null}
            </section>
          ) : null}

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
