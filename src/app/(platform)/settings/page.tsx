"use client"

import SegmentedControl from "@/src/components/ui/SegmentedControl";
import { useState } from "react";
import AccountSettings from "./account/accountSettings";

export default function SettingsPage() {
  const choices = [
    { value: "account", label: "Account" },
    { value: "al", label: "Al" },
    { value: "billing", label: "Billing" },
    { value: "privacy", label: "Privacy" },
  ];

  const [selectedTab, setSelectedTab] = useState(choices[0].value);
  return (
    <main className="w-full p-6 h-full">
      <h1 className="text-3xl font-semibold tracking-tight text-content">Settings</h1>
      <p className="text-muted-foreground">
      Manage your account and Al configuration
      </p>
      <div className="flex flex-col gap-4 w-full h-auto">
        <SegmentedControl choices={choices} onChange={setSelectedTab}/>
      </div>
      <div className="flex flex-col gap-4 bg-green-500 w-full h-[75%]">
        {selectedTab === "account" && <AccountSettings />}
        {/* {selectedTab === "al" && <AlSettings />}
        {selectedTab === "billing" && <BillingSettings />}
        {selectedTab === "privacy" && <PrivacySettings />}  */}
      </div>
    </main>
  );
}

