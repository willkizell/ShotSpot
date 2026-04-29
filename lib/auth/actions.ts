"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .single();

  redirect(userData?.role === "coach" ? "/coach/dashboard" : "/athlete/dashboard");
}

export async function signUpAsAthlete(email: string, password: string, fullName: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "athlete" satisfies UserRole },
    },
  });
  if (error) return { error: error.message };
  redirect("/athlete/dashboard");
}

export async function signUpAsCoach(email: string, password: string, fullName: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "coach" satisfies UserRole },
    },
  });
  if (error) return { error: error.message };
  redirect("/coach/dashboard");
}

export async function signInWithGoogle(role: UserRole): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?role=${role}`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  if (error) redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
}

export async function signInWithApple(role: UserRole): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?role=${role}`,
    },
  });
  if (error) redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
