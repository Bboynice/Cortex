"use server";

import { redirect } from "next/navigation";
import { getAuthRedirectPath } from "@/src/lib/auth";

export async function loginAction(formData: FormData) {
  void formData;
  redirect(getAuthRedirectPath());
}

export async function registerAction(formData: FormData) {
  void formData;
  redirect(getAuthRedirectPath());
}
