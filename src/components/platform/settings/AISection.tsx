'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import LabeledInput from "@/src/components/ui/LabeledInput";
import Pill from "@/src/components/ui/Pill";
import { Bot, BrainCircuit, Save, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import Dropdown from "@/src/components/ui/Dropdown";
import { useState, useEffect } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { useModalStore } from "@/src/hooks/use-modal-store";
import { useAuthStore } from "@/src/store/useAuthStore";
import { createClient } from "@/src/lib/supabase/client";

export default function AISection() {
  const { addToast } = useToast();
  const { onOpen } = useModalStore();
  const { user } = useAuthStore();

  // Text Inputs (Saved manually via button)
  const [assistantName, setAssistantName] = useState("");
  const [responseStyle, setResponseStyle] = useState("");
  const [codeFocus, setCodeFocus] = useState("");
  const [preferredModel, setPreferredModel] = useState("gpt-4o-mini");

  // Dropdowns (Auto-saved instantly)
  const [autoSuggestions, setAutoSuggestions] = useState("enabled");
  const [reportVerbosity, setReportVerbosity] = useState("compact");
  const [architectMode, setArchitectMode] = useState("mentor");

  // Read-only Limits (Fetched from profiles)
  const [monthlyCredits, setMonthlyCredits] = useState(100);
  const [contextWindow, setContextWindow] = useState(8000);

  // 1. Fetch data on load
  useEffect(() => {
    async function fetchAISettings() {
      if (!user?.id) return;
      const supabase = createClient();

      // Fetch AI preferences from user_settings
      const { data: settings } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (settings) {
        setAssistantName(settings.assistant_name || "");
        setResponseStyle(settings.response_style || "");
        setCodeFocus(settings.code_generation_focus || "");
        setPreferredModel(settings.preferred_model || "gpt-4o-mini");
        
        setAutoSuggestions(settings.auto_suggestions ? "enabled" : "disabled");
        setReportVerbosity(settings.report_verbosity || "compact");
        setArchitectMode(settings.architect_mode || "mentor");
      }

      // Fetch limits from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("monthly_credits, context_window_budget")
        .eq("id", user.id)
        .single();
        
      if (profile) {
        setMonthlyCredits(profile.monthly_credits);
        setContextWindow(profile.context_window_budget);
      }
    }
    fetchAISettings();
  }, [user?.id]);

  // 2. Manual Save Function (Top Section)
  const handleSaveAIPreferences = async () => {
    if (!user?.id) return;
    const supabase = createClient();

    const { error } = await supabase
      .from("user_settings")
      .update({
        assistant_name: assistantName,
        response_style: responseStyle,
        code_generation_focus: codeFocus,
        preferred_model: preferredModel,
      })
      .eq("user_id", user.id);

    if (error) {
      addToast("Failed to save AI preferences.", "error");
    } else {
      addToast("AI preferences have been saved.", "success");
    }
  };

  // 3. Auto-Save Functions (Middle Section)
  const handleAutoSuggestionsChange = async (value: string) => {
    setAutoSuggestions(value);
    if (!user?.id) return;
    
    const supabase = createClient();
    const { error } = await supabase
      .from("user_settings")
      .update({ auto_suggestions: value === "enabled" }) // Convert string to boolean
      .eq("user_id", user.id);

    if (!error) addToast(`Auto suggestions have been ${value}.`, "success");
  };

  const handleVerbosityChange = async (value: string) => {
    setReportVerbosity(value);
    if (!user?.id) return;
    
    const supabase = createClient();
    const { error } = await supabase.from("user_settings").update({ report_verbosity: value }).eq("user_id", user.id);
    if (!error) addToast(`Report verbosity has been set to ${value}.`, "success");
  };

  const handleArchitectChange = async (value: string) => {
    setArchitectMode(value);
    if (!user?.id) return;
    
    const supabase = createClient();
    const { error } = await supabase.from("user_settings").update({ architect_mode: value }).eq("user_id", user.id);
    if (!error) addToast(`The Architect mode has been set to ${value}.`, "success");
  };

  return (
    <div className="w-full max-w-none space-y-6">
      <section className="settings-section">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
                <BrainCircuit size={18} aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-content">AI Preferences</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Pill
              text="GPT-5.4 Ready"
              variant="content"
              icon={<Sparkles size={14} className="text-violet-500" aria-hidden="true" />}
              className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-xs"
            />
            <Pill
              text="Workspace Aware"
              variant="content"
              icon={<ShieldCheck size={14} className="text-emerald-500" aria-hidden="true" />}
              className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs"
            />
          </div>
        </header>

        <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2 md:items-start">
          <LabeledInput
            label="Assistant Name"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            helperText="Used across your AI workspace and assistant headers."
          />
          <LabeledInput
            label="Response Style"
            value={responseStyle}
            onChange={(e) => setResponseStyle(e.target.value)}
          />
          <div className="flex w-full flex-col gap-2">
            <span className="text-sm font-semibold text-muted-foreground">Preferred Model</span>
            <div className="inline-flex w-fit max-w-full items-center rounded-xl bg-background/25 px-4 py-3">
              <Dropdown
                choices={[
                  { value: "gpt-5-nano", label: "GPT-5 Nano" },
                  { value: "gpt-5-mini", label: "GPT-5 Mini" },
                  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
                  { value: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
                  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
                ]}
                value={preferredModel}
                onChange={(value) => setPreferredModel(value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">Default model for new sessions.</p>
          </div>
          <LabeledInput
            label="Code Generation Focus"
            value={codeFocus}
            onChange={(e) => setCodeFocus(e.target.value)}
          />
        </div>

        <div className="mt-6 border-t border-border/80 pt-6">
          <GlowButton
            effect="none"
            color="primary"
            className="w-fit justify-start gap-2 rounded-xl px-6 py-3 text-sm font-semibold normal-case"
            onClick={() => {
              onOpen("save-profile", { // Reusing your save modal design
                title: "Confirm Save Changes",
                description: "Are you sure you want to save these AI preferences?",
                submitText: "Save",
                cancelText: "Cancel",
                action: handleSaveAIPreferences, // Tied to the Supabase function
              });
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Save size={16} aria-hidden="true" />
              Save AI Preferences
            </span>
          </GlowButton>
        </div>
      </section>

      <section className="settings-section">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-500">
            <Bot size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Assistant Behavior</h2>
        </header>

        <div className="mt-6 space-y-3">
          <div className="settings-row flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-content">Auto Suggestions</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Suggest follow-up prompts and implementation ideas after each response.
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "enabled", label: "Enabled" },
                { value: "disabled", label: "Disabled" },
              ]}
              value={autoSuggestions}
              onChange={handleAutoSuggestionsChange}
            />
          </div>
          <div className="settings-row flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-content">Report Verbosity</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Determines how big or concise the report generation will be.
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "compact", label: "Compact" },
                { value: "loose", label: "Loose" },
              ]}
              value={reportVerbosity}
              onChange={handleVerbosityChange}
            />
          </div>
          <div className="settings-row flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-content">The Architect Mode</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Determines the style of report generation: encouraging or strict.
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "mentor", label: "Mentor Mode" },
                { value: "brutal", label: "Senior Mode" },
              ]}
              value={architectMode}
              onChange={handleArchitectChange}
            />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
            <Wand2 size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Usage & Limits</h2>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* AI CREDITS WALLET */}
          <div className="settings-row">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-content">Monthly AI Credits</span>
              <span className="text-xs font-medium text-muted-foreground">
                {/* Format the numbers nicely with commas */}
                {monthlyCredits.toLocaleString()} / 10,000 remaining
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/70">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" 
                style={{ 
                  // Calculate the percentage remaining. Max is 100%, Min is 0%.
                  width: `${Math.max(0, Math.min(100, (monthlyCredits / 10000) * 100))}%` 
                }} 
              />
            </div>
          </div>

          <div className="settings-row">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-content">Context Window Limit</span>
              <span className="text-xs font-medium text-muted-foreground">
                {contextWindow.toLocaleString()} tokens
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/70">
              <div 
                className="h-full rounded-full bg-cyan-500 transition-all duration-1000 ease-out" 
                style={{ 
                  // If they have 8000 (Free), show 25%. If they have 32000+ (Pro), show 100%.
                  width: contextWindow >= 32000 ? '100%' : '25%' 
                }} 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}