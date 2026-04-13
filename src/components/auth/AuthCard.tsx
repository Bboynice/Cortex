import type { ReactNode } from "react";
import Link from "next/link";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLabel: string;
};

export default function AuthCard({
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLabel,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/10 p-6 shadow-xl backdrop-blur">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/70">{description}</p>
      </div>

      {children}

      <p className="mt-6 text-center text-sm text-white/70">
        {footerText}{" "}
        <Link href={footerHref} className="font-medium text-white underline underline-offset-4">
          {footerLabel}
        </Link>
      </p>
    </div>
  );
}
