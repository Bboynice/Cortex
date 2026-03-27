'use client';

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import SegmentedControl from "@/src/components/ui/SegmentedControl";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { value: "/settings/profile", label: "Profile" },
    { value: "/settings/ai", label: "AI" },
    { value: "/settings/billing", label: "Billing" },
    { value: "/settings/privacy", label: "Privacy" },
  ];

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="sticky top-0 z-10 w-full border-b border-border/70 bg-background/70 px-6 py-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-content">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and AI configuration</p>

        <div className="mt-5">
          <SegmentedControl choices={tabs} value={pathname} onChange={(value) => router.push(value)} />
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full overflow-y-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
}