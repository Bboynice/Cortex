'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import Pill from "@/src/components/ui/Pill";
import { AlertTriangle, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import Dropdown from "@/src/components/ui/Dropdown";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { useModalStore } from "@/src/hooks/use-modal-store";


export default function PrivacySection() {
  const { addToast } = useToast();
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [essentialCookies, setEssentialCookies] = useState("enabled");
  const [sessionHistory, setSessionHistory] = useState("disabled");
  const { onOpen } = useModalStore();
  return (
    <div className="w-full max-w-none space-y-6">
      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-content">Privacy Controls</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Manage visibility, data handling, and account security preferences.
            </p>
          </div>

          <Pill
            text="Protected"
            variant="content"
            icon={<LockKeyhole size={14} className="text-emerald-300" aria-hidden="true" />}
            className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-100"
          />
        </header>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Profile Visibility</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Control whether your public profile is visible to other users.
              </p>
            </div>
            <Dropdown
            choices={[
              { value: "private", label: "Private" },
              { value: "public", label: "Public" },
            ]}
            value={profileVisibility}
            onChange={(value) => {
              setProfileVisibility(value);
              addToast(`Profile visibility has been set to ${value}.`, "success");
            }}
            />
        
          </div>

         

        
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <EyeOff size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Data Management and Essential Cookies</h2>
        </header>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Allow Essential Cookies</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Allow essential cookies to keep your account secure and functional.
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "enabled", label: "Enabled" },
                { value: "disabled", label: "Disabled" },
              ]}
              value={essentialCookies}
              onChange={(value) => {
                setEssentialCookies(value);
                addToast(`Essential cookies have been ${value}.`, "success");
              }}
         
            />
          </div>
    

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Clear Session History</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Clear all data and history associated with your account, including saved prompts, generated summaries, session records, and reset your statistics to start fresh.
              </p>
            </div>
            <GlowButton
              effect="none"
              roundness={12}
              color="primary"
              className="w-fit justify-start rounded-xl px-5 py-3 text-sm font-semibold normal-case"
              onClick={() => {
                onOpen("confirm-delete", {
                  title: "Clear Session History",
                  description: "Are you sure you want to clear your session history?",
                  action: async () => {
                    addToast("Session history has been cleared.", "success");
                  },
                });
              }}
         
            >
              Clear History
            </GlowButton>
          </div>
     
        </div>
      </section>

     
    </div>
  );
}

