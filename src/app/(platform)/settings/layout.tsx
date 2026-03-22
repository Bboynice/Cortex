import type { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full w-full h-full">{children}</main>;
}

