"use server";

import { cookies } from "next/headers";
import { createClient } from "@/src/lib/supabase/server";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("cortex-session");

  return { success: true };
}
