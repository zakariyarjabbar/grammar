"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

export async function signInAction(formData: FormData) {
  const email = formString(formData, "email");
  const password = formString(formData, "password");

  if (!email || !password) {
    redirectWithMessage("/login", "Email and password are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithMessage("/login", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const fullName = formString(formData, "full_name");
  const email = formString(formData, "email");
  const password = formString(formData, "password");
  const confirmPassword = formString(formData, "confirm_password");

  if (!email || !password) {
    redirectWithMessage("/register", "Email and password are required.");
  }

  if (password.length < 6) {
    redirectWithMessage("/register", "Password must be at least 6 characters.");
  }

  if (confirmPassword && password !== confirmPassword) {
    redirectWithMessage("/register", "Passwords do not match.");
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: origin ? `${origin}/dashboard` : undefined
    }
  });

  if (error) {
    redirectWithMessage("/register", error.message);
  }

  redirectWithMessage("/login", "Account created. Check your email if confirmation is enabled.");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updateProfileAction(formData: FormData) {
  const fullName = formString(formData, "full_name");
  const currentLevelId = formString(formData, "current_level_id") || null;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      current_level_id: currentLevelId,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) {
    redirectWithMessage("/settings", error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  redirectWithMessage("/settings", "Settings saved.");
}
