"use server";

import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession } from "@/lib/admin-session";

export type AdminLoginState = { error?: string } | undefined;

export async function adminLogin(
  state: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !password || password !== adminPassword) {
    return { error: "Invalid password." };
  }

  await createAdminSession();
  redirect("/admin/products");
}

export async function adminLogout() {
  await deleteAdminSession();
  redirect("/admin/login");
}
