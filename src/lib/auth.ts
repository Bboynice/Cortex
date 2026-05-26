import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/src/store/useAuthStore";

export const AUTH_REDIRECT_PATH = "/dashboard";

export function getAuthRedirectPath() {
  return AUTH_REDIRECT_PATH;
}

/** Map Supabase auth user → app store user. */
export function mapSupabaseUser(
  user: SupabaseUser,
  overrides?: Partial<Pick<User, "name" | "username" | "points" | "email">>
): User {
  const fullName =
    (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "").trim();
  const email = overrides?.email ?? user.email ?? "";
  const localPart = email.split("@")[0] || "user";

  return {
    id: user.id,
    email,
    name: overrides?.name ?? (fullName || localPart),
    username: overrides?.username ?? (fullName.split(/\s+/)[0] || localPart),
    points: overrides?.points ?? 1000,
  };
}
