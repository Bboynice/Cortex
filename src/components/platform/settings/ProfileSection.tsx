'use client';

import Pill from "@/src/components/ui/Pill";
import LabeledInput from "@/src/components/ui/LabeledInput";
import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import { AlertTriangle, Crown, Github, Mail, Save, ShieldCheck, User2 } from "lucide-react";
import { useModalStore } from "@/src/hooks/use-modal-store";
import { useAuthStore } from "@/src/store/useAuthStore";
import CortexPilotLicense from "@/src/components/ui/CortexPilotLicense";
import { logoutAction } from "@/src/app/(auth)/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/src/hooks/use-toast";
import AccountCard from "@/src/components/ui/AccountCard";
import { createClient } from "@/src/lib/supabase/client";


export default function ProfileSection() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { addToast } = useToast();
  const { onOpen } = useModalStore();
  const { user, updateProfile } = useAuthStore();
  const fullName = user?.name ?? "Unknown";
  const email = user?.email ?? "Unknown";
  const username = user?.username ?? "Unknown";
  const points = user?.points ?? 0;

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
    const supabase = createClient();
    await supabase.auth.signOut();
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
    <div className="w-full max-w-none space-y-6">
      <section className="settings-section overflow-visible p-7 sm:p-8">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
            <User2 size={20} aria-hidden="true" />
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-content">Profile Information</h2>
        </header>

        <div className="mt-8 grid gap-10 overflow-visible lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <div className="flex min-h-0 min-w-0 h-full flex-col gap-8 overflow-visible min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-5">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <div className="space-y-2">
                <div className="text-2xl font-semibold tracking-tight text-content sm:text-3xl sm:leading-tight">
                  {fullName}
                </div>
                <div className="text-base text-muted-foreground">{email}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Pill
                  text="Verified"
                  variant="content"
                  icon={<ShieldCheck size={16} className="text-emerald-500" aria-hidden="true" />}
                  className="rounded-lg bg-emerald-500/15 px-3.5 py-2 text-sm"
                />
                <Pill
                  text="Pro Member"
                  variant="content"
                  icon={<Crown size={16} className="text-orange-500" aria-hidden="true" />}
                  className="rounded-lg bg-orange-500/15 px-3.5 py-2 text-sm"
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

          <div className="flex h-full w-full flex-col gap-4 border-t border-border pt-10 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="text-2xl font-semibold tracking-tight text-content">Connected Accounts</h3>
            <AccountCard
              accountLabel={username}
              showAtPrefix
              provider="GitHub"
              icon={<Github size={18} aria-hidden="true" />}
            />
            <AccountCard
              accountLabel={email}
              showAtPrefix={false}
              provider="Google"
              icon={<Mail size={18} aria-hidden="true" />}
            />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="w-full space-y-5 pt-2">
          <LabeledInput
            label="Full Name"
            autoComplete="name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
          <LabeledInput
            label="Email Address"
            disabled
            className="opacity-90"
            autoComplete="email"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
          />
          <LabeledInput
            label="Username"
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

      <section className="theme-sync rounded-2xl border border-red-500/35 bg-card/40 p-6 shadow-sm">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <AlertTriangle size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-red-500">Danger Zone</h2>
        </header>

        <p className="mt-3 text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/15 active:brightness-95"
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
