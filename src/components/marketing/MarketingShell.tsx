'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Code2, Github, ShieldCheck, Twitter } from "lucide-react";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.16),transparent_24%),linear-gradient(180deg,#050816_0%,#060d1d_42%,#091326_100%)] text-content">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 pt-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/20">
                  <Code2 size={20} aria-hidden="true" />
                </span>
                <div>
                  <div className="text-base font-semibold text-white">Cortex</div>
                  <div className="text-xs text-slate-400">AI coding missions for real progress</div>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 rounded-2xl border border-white/8 bg-white/4 p-1 md:flex">
                {navLinks.map((link) => {
                  const isActive = pathname === link.match;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={[
                        "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/6 hover:text-white",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <Link
                  href="/pricing"
                  className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/6 sm:inline-flex"
                >
                  See Plans
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 active:brightness-95"
                >
                  Sign In
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-16 pt-8 sm:pt-10">
          {title ? (
            <section className="mx-auto max-w-3xl py-10 text-center sm:py-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                <ShieldCheck size={14} aria-hidden="true" />
                Cortex Public Docs
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
            </section>
          ) : null}

          {children}
        </main>

        <footer className="border-t border-white/10 py-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-white/8 bg-slate-950/55 px-5 py-6 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Code2 size={18} aria-hidden="true" />
              </span>
              <div>
                <div className="text-sm font-semibold text-white">Cortex</div>
                <p className="text-sm text-slate-400">Daily AI-guided practice for developers who want momentum.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <Link href="/pricing" className="transition hover:text-white">
                Pricing
              </Link>
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/dashboard" className="transition hover:text-white">
                Product
              </Link>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
                <Twitter size={18} aria-hidden="true" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
                <Github size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
