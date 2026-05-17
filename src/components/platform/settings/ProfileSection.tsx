'use client';

import Pill from "@/src/components/ui/Pill";
import LabeledInput from "@/src/components/ui/LabeledInput";
import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import { AlertTriangle, Crown, Github, Plus, Save, ShieldCheck, Unlink2, User2 } from "lucide-react";
import { useModalStore } from "@/src/hooks/use-modal-store";
import { useAuthStore } from "@/src/store/useAuthStore";
import CortexPilotLicense from "@/src/components/ui/CortexPilotLicense";
import { logoutAction } from "@/src/app/(auth)/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/src/hooks/use-toast";


export default function ProfileSection() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { addToast } = useToast();
  // UI only (no functionality yet)
  const { onOpen } = useModalStore();
  const { user, updateProfile } = useAuthStore();
  const fullName = user?.name ?? "Unknown";
  const email = user?.email ?? "Unknown";
  const username = user?.username ?? "Unknown";
  const points = user?.points ?? 820;

  const [tempName, setTempName] = useState(user?.name ?? "");
  const [tempEmail, setTempEmail] = useState(user?.email ?? "");
  const [tempUsername, setTempUsername] = useState(user?.username ?? "");

  useEffect(() => {
    if (!user) return;
    setTempName(user.name);
    setTempEmail(user.email);
    setTempUsername(user.username);
  }, [user]);

  const handleLogout = async () => {
    clearAuth();
    await logoutAction();
    router.push("/");
    router.refresh();

  };

  const handleSaveProfile = async () => {
   try {
    updateProfile({ name: tempName, email: tempEmail, username: tempUsername });
    addToast("Profile updated successfully", "success");
   } catch (error) {
    addToast("Failed to update profile", "error");
   }
  };

  return (
    <div className="w-full max-w-none space-y-6 ">
      {/* Profile Information + Connected Accounts */}
      <section className="overflow-visible rounded-2xl border dark:border-border dark:bg-card/40 p-7 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-8">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl dark:bg-orange-500/15 dark:text-orange-400">
            <User2 size={20} aria-hidden="true" />
          </span>
          <h2 className="text-xl font-semibold dark:text-content tracking-tight">Profile Information</h2>
        </header>

        <div className="mt-8 grid gap-10 overflow-visible lg:grid-cols-2 lg:items-stretch lg:gap-8">
          {/* Left: identity + pilot license */}
          <div className="flex min-h-0 min-w-0 h-full flex-col gap-8 overflow-visible min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-5">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <div className="space-y-2">
                <div className="text-2xl font-semibold tracking-tight dark:text-content sm:text-3xl sm:leading-tight">
                  {fullName}
                </div>
                <div className="text-base dark:text-muted-foreground">{email}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Pill
                  text="Verified"
                  variant="content"
                  icon={<ShieldCheck size={16} className="dark:text-emerald-300" aria-hidden="true" />}
                  className="dark:bg-emerald-500/15 dark:text-emerald-200 px-3.5 py-2 text-sm rounded-lg"
                />
                <Pill
                  text="Pro Member"
                  variant="content"
                  icon={<Crown size={16} className="dark:text-orange-300" aria-hidden="true" />}
                  className="dark:bg-orange-500/15 dark:text-orange-200 px-3.5 py-2 text-sm rounded-lg"
                />
              </div>

              <GlowButton
                color="primary"
                effect="none"
                roundness={8}
                className="w-fit text-sm font-semibold"
                onClick={() =>
                  onOpen("confirm-delete", {
                    title: "Confirm Log Out",
                    description: "Are you sure you want to log out?",
                    submitText: "Log Out",
                    cancelText: "Cancel", 
                    action: handleLogout,
                  })
                }
              >
                Log Out
              </GlowButton>
            </div>

            <div className="relative flex shrink-0 justify-center overflow-visible py-2 min-[520px]:justify-start">
              <CortexPilotLicense licenseId="434" name={username} points={points} />
            </div>
          </div>

          {/* Right: connected accounts — stretches to match left column height */}
          <div className="flex min-h-0 min-w-0 h-full flex-col border-t dark:border-border/60 pt-10 lg:border-l lg:dark:border-border/60 lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex shrink-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl dark:bg-slate-500/15 dark:text-slate-200">
                <Github size={18} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold dark:text-content tracking-tight">Connected Accounts</h3>
            </div>

            <div className="mt-6 flex min-h-0 flex-1 flex-col justify-start">
              <div className="space-y-3">
                <div className="flex flex-col gap-4 rounded-xl border dark:border-border dark:bg-background/25 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border dark:border-border dark:bg-[#24292f]/50 dark:ring-1 dark:ring-white/5">
                      <Github size={20} className="dark:text-white" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold dark:text-content">GitHub</div>
                      <div className="mt-0.5 text-xs dark:text-muted-foreground truncate">@{username}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl dark:bg-background px-4 py-2 text-sm font-semibold dark:text-muted-foreground dark:ring-1 dark:ring-border dark:hover:text-content active:brightness-95 sm:self-center"
                  >
                    <Unlink2 size={16} aria-hidden="true" />
                    Disconnect
                  </button>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed dark:border-border/80 dark:bg-background/20 px-4 py-3 text-sm font-medium dark:text-muted-foreground dark:hover:border-border dark:hover:bg-background/25 dark:hover:text-content active:brightness-95"
                >
                  <Plus size={16} aria-hidden="true" />
                  Connect Another Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border dark:border-border p-6 dark:bg-surface dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
     
        

        <div className=" w-full h-full space-y-5 pt-6 dark:bg-surface">
          <LabeledInput
            label="Full Name"
            className="dark:bg-foreground/40"
            autoComplete="name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
          <LabeledInput
            label="Email Address"
            disabled
            className="dark:bg-foreground/40 opacity-90"
            autoComplete="email"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
          />
          <LabeledInput
            label="Username"
            className="dark:bg-foreground/40"
            autoComplete="username"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
          />
             <GlowButton
            color="primary"
            effect="glow"
            onClick={() =>
              onOpen("save-profile", {
                title: "Confirm Save Changes",
                description: "Are you sure you want to save changes?",
                submitText: "Save Changes",
                cancelText: "Cancel",
                action: handleSaveProfile,
              })
            }
            className="normal-case px-6 py-3 rounded-xl text-sm font-semibold gap-2 justify-start w-fit"
          >
            <span className="inline-flex items-center gap-2">
              <Save size={16} aria-hidden="true" />
              Save Changes
            </span>
          </GlowButton>
        </div>

      
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border dark:border-red-500/35 dark:bg-card/40 p-6 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl dark:bg-red-500/10 dark:text-red-400">
            <AlertTriangle size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold dark:text-red-400 tracking-tight">Danger Zone</h2>
        </header>

        <p className="mt-3 text-sm dark:text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border dark:border-red-500/40 dark:bg-red-500/10 px-5 py-3 text-sm font-semibold dark:text-red-300 dark:hover:bg-red-500/15 active:brightness-95"
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