"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const userId = signInData.user.id;

  // Fall back to user_metadata role if public.users row doesn't exist yet
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role = userData?.role ?? signInData.user.user_metadata?.role;

  if (role === "coach") {
    const { data: profile } = await supabase
      .from("coach_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    redirect(profile ? "/coach/dashboard" : "/coach/onboarding");
  }
  redirect("/athlete/dashboard");
}

export async function signUpAsAthlete(email: string, password: string, fullName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "athlete" satisfies UserRole },
    },
  });
  if (error) return { error: error.message };
  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
      role: "athlete" satisfies UserRole,
    });
  }
  redirect("/athlete/dashboard");
}

export async function signUpAsCoach(email: string, password: string, fullName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "coach" satisfies UserRole },
    },
  });
  if (error) return { error: error.message };
  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
      role: "coach" satisfies UserRole,
    });
  }
  redirect("/coach/onboarding");
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
