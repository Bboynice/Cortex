import { redirect } from "next/navigation";

export default function SettingsRootPage() {
  // Automatically jump to the first tab
  redirect("/settings/profile");
}