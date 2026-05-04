"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").trim(),
  email: z.string().email("Please enter a valid email.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export type AuthFormState =
  | { errors?: { name?: string[]; email?: string[]; password?: string[] }; message?: string }
  | undefined;

export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["An account with this email already exists."] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  await createSession(user.id);
  redirect("/account/orders");
}

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { message: "Invalid email or password." };
  }

  await createSession(user.id);
  redirect("/account/orders");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
