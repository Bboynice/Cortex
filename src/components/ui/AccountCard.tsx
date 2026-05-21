import type { ReactNode } from "react";
import { Unlink2, Plus } from "lucide-react";
import { useState } from "react";


type AccountCardProps = {
  /** Handle or email shown under the provider name */
  accountLabel: string;
  provider: string;
  icon: ReactNode;
  /** If true, prefix with @ (e.g. GitHub). If false, show label as-is (e.g. Google email). */
  showAtPrefix?: boolean;
};

export default function AccountCard({ accountLabel, provider, icon, showAtPrefix = true }: AccountCardProps) {
  const line = showAtPrefix ? `@${accountLabel.replace(/^@/, "")}` : accountLabel;
  const [isConnected, setIsConnected] = useState(false);
  return (
    <div className="flex min-h-0 min-w-0 h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-start">
        <div className="space-y-3">
          <div className="theme-sync flex flex-col gap-4 rounded-xl border border-border bg-muted/20 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-content ring-1 ring-border">
                {icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-content">{!isConnected ? "Not Connected" : provider}</div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">{!isConnected ? "Connect to your account to get started" : line}</div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-content active:brightness-95 sm:self-center"
              onClick={() => setIsConnected(!isConnected)}
            >
              {isConnected ? <Unlink2 size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
              {isConnected ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
