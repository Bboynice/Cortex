'use client';

import Pill from "@/src/components/ui/Pill";
import LabeledInput from "@/src/components/ui/LabeledInput";
import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import { AlertTriangle, Camera, Crown, Github, Plus, Save, ShieldCheck, Unlink2, User2 } from "lucide-react";
import { useModalStore } from "@/src/hooks/use-modal-store";

export default function ProfileSection() {
  // UI only (no functionality yet)
  const fullName = "Alex Thompson";
  const email = "alex.thompson@email.com";
  const username = "alexthompson";
  const { onOpen } = useModalStore();


  return (
    <div className="w-full max-w-none space-y-6">
      {/* Profile Information */}
      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
            <User2 size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold text-content tracking-tight">Profile Information</h2>
        </header>

        <div className="mt-6 flex items-start gap-5">
          <div className="relative shrink-0">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-background/40">
              {/* no src yet to avoid empty string warnings */}
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                AT
              </div>
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-orange-500 text-white shadow-lg hover:brightness-110 active:brightness-95"
              aria-label="Change avatar (UI only)"
            >
              <Camera size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="text-base font-semibold text-content">{fullName}</div>
            <div className="text-xs text-muted-foreground">{email}</div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Pill
                text="Verified"
                variant="content"
                icon={<ShieldCheck size={14} className="text-emerald-300" aria-hidden="true" />}
                className="bg-emerald-500/15 text-emerald-200 px-3 py-1.5 text-xs rounded-lg"
              />
              <Pill
                text="Pro Member"
                variant="content"
                icon={<Crown size={14} className="text-orange-300" aria-hidden="true" />}
                className="bg-orange-500/15 text-orange-200 px-3 py-1.5 text-xs rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5 border-t border-border/80 pt-6">
          <LabeledInput
            label="Full Name"
            defaultValue={fullName}
            className="bg-foreground/40"
            autoComplete="name"
          />
          <LabeledInput
            label="Email Address"
            defaultValue={email}
            disabled
            className="bg-foreground/40 opacity-90"
            autoComplete="email"
          />
          <LabeledInput
            label="Username"
            defaultValue={username}
            className="bg-foreground/40"
            autoComplete="username"
          />
        </div>

        <div className="mt-6 border-t border-border/80 pt-6">
          <GlowButton
            effect="none"
            color="primary"
            className="normal-case px-6 py-3 rounded-xl text-sm font-semibold gap-2 justify-start w-fit"
          >
            <span className="inline-flex items-center gap-2">
              <Save size={16} aria-hidden="true" />
              Save Changes
            </span>
          </GlowButton>
        </div>
      </section>

      {/* Connected Accounts */}
      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-muted/10 text-muted-foreground">
            <Github size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold text-content tracking-tight">Connected Accounts</h2>
        </header>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/40 border border-border">
                <Github size={18} className="text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-content">GitHub</div>
                <div className="text-xs text-muted-foreground truncate">@{username}</div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-muted/20 px-4 py-2 text-sm font-semibold text-content hover:bg-muted/25 active:brightness-95"
            >
              <Unlink2 size={16} aria-hidden="true" />
              Disconnect
            </button>
          </div>

          <button
            type="button"
            className="w-full rounded-xl border border-border bg-background/20 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-background/25 hover:text-content active:brightness-95"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Plus size={16} aria-hidden="true" />
              Connect Another Account
            </span>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border border-red-500/35 bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold text-red-400 tracking-tight">Danger Zone</h2>
        </header>

        <p className="mt-3 text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/15 active:brightness-95"
            onClick={() => onOpen("confirm-delete", {
              title: "Delete Account",
              description: "Once you delete your account, there is no going back. Please be certain.",
              submitText: "Delete Account",
              cancelText: "Cancel",
              action: () => {
                console.log("Delete account");
              },
            })}
          >
            <AlertTriangle size={16} aria-hidden="true" />
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}