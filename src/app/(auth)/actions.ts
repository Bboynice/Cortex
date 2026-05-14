"use server";

import { cookies } from "next/headers";

// Mock User for now (replace with DB query later)
const MOCK_USER = {
  id: "1",
  email: "pilot@cortex.sh",
  name: "Cortex Pilot",
  heatLevel: 10,
};

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // Logic: Verify credentials here later
  if (!email || !password) return { error: "Missing credentials" };

  // 1. Set the cookie so Middleware allows access
  const cookieStore = await cookies();
  cookieStore.set("cortex-session", "mock-token-xyz", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  // 2. Return the user data to the client
  return { success: true, user: MOCK_USER };
}

export async function registerAction(formData: FormData) {
  // Similar logic for registration
  const cookieStore = await cookies();
  cookieStore.set("cortex-session", "mock-token-xyz", { httpOnly: true, path: "/" });

  return { success: true, user: MOCK_USER };
}