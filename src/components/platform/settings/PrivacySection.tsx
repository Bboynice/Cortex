'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import Pill from "@/src/components/ui/Pill";
import { EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import Dropdown from "@/src/components/ui/Dropdown";
import { useToast } from "@/src/hooks/use-toast";
import { useState , useEffect} from "react";
import { useModalStore } from "@/src/hooks/use-modal-store";
import { useAuthStore } from "@/src/store/useAuthStore";
import { createClient } from "@/src/lib/supabase/client";

export default function PrivacySection() {
  const { addToast } = useToast();
  const { onOpen } = useModalStore();
  const { user , updateProfile} = useAuthStore();
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [analyticsCookies, setAnalyticsCookies] = useState("enabled");
  useEffect(() => {
    async function fetchSettings() {
      if (!user?.id) return;
      const supabase = createClient();

      const [profileRes, settingsRes] = await Promise.all([
        supabase.from("profiles").select("profile_visibility").eq("id", user.id).single(),
        supabase.from("user_settings").select("allow_analytics_cookies").eq("user_id", user.id).single()
      ]);

      if (profileRes.data?.profile_visibility) {
        setProfileVisibility(profileRes.data.profile_visibility);
      }
      if (settingsRes.data !== null) {
        setAnalyticsCookies(settingsRes.data.allow_analytics_cookies ? "enabled" : "disabled");
      }
    }
    fetchSettings();
  }, [user?.id]);

  const handleProfileVisibilityChange = async (value: string) => {
    setProfileVisibility(value);
    if (!user?.id) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ profile_visibility: value })
      .eq("id", user.id);

    if (error) {
      addToast("Failed to update visibility.", "error");
    } else {
      addToast(`Profile visibility has been set to ${value}.`, "success");
    }
  };

  const handleAnalyticsCookiesChange = async (value: string) => {
    setAnalyticsCookies(value);
    if (!user?.id) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("user_settings")
      .update({ allow_analytics_cookies: value === "enabled" })
      .eq("user_id", user.id);

    if (error) {
      addToast("Failed to update cookie preferences.", "error");
    } else {
      addToast(`Analytics cookies have been ${value}.`, "success");
    }
  };

  // 3. Clear History Action
  const handleClearHistory = async () => {
    try {
      const supabase = createClient();
      
      // Trigger the secure database wipe RPC
      const { error } = await supabase.rpc("clear_user_history");
      if (error) throw new Error(error.message);

      // Instantly reset their local points to zero
      updateProfile({ points: 0 });
      addToast("Session history has been cleared.", "success");

      // Hard refresh to wipe any cached UI state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      addToast(error.message || "Failed to clear history.", "error");
    }
  };
  return (
    <div className="w-full max-w-none space-y-6">
      <section className="settings-section">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
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
            icon={<LockKeyhole size={14} className="text-emerald-500" aria-hidden="true" />}
            className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs"
          />
        </header>

        <div className="mt-6 space-y-3">
          <div className="settings-row flex items-center justify-between gap-4">
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
              onChange={handleProfileVisibilityChange}
            />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
            <EyeOff size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Data Management and Essential Cookies</h2>
        </header>

        <div className="mt-6 flex flex-col gap-4">
          <div className="settings-row flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-content">Allow Analytics Cookies</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Allow analytics cookies to help us improve our service.
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "enabled", label: "Enabled" },
                { value: "disabled", label: "Disabled" },
              ]}
              value={analyticsCookies}
              onChange={handleAnalyticsCookiesChange}
            />
          </div>

          <div className="settings-row flex items-center justify-between gap-4">
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
              className="w-fit shrink-0 justify-start rounded-xl px-5 py-3 text-sm font-semibold normal-case"
              onClick={handleClearHistory}
            >
              Clear History
            </GlowButton>
          </div>
        </div>
      </section>
    </div>
  );
}
