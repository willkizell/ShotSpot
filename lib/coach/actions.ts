"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CoachingHistoryEntry, CoachPackage } from "@/lib/types/coach";

export interface OnboardingData {
  // Step 1
  full_name: string;
  organization: string;
  location: string;
  remote: boolean;
  // Step 2
  events: string[];
  years_coaching: number;
  short_bio: string;
  // Step 3
  coaching_history: CoachingHistoryEntry[];
  // Step 4
  intake_mode: "instant_join" | "application_required";
  packages: CoachPackage[];
  athlete_capacity: number;
  response_time: string;
}

export async function submitCoachProfile(data: OnboardingData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // Ensure a users row exists (email signups don't go through the OAuth callback)
  await supabase.from("users").upsert({
    id: user.id,
    email: user.email!,
    full_name: data.full_name,
    role: "coach",
  });

  const startingPrice = data.packages.length > 0
    ? Math.min(...data.packages.map((p) => p.price))
    : null;

  const { error } = await supabase.from("coach_profiles").upsert({
    id: user.id,
    full_name: data.full_name,
    organization: data.organization || null,
    location: data.location,
    remote: data.remote,
    events: data.events,
    years_coaching: data.years_coaching,
    short_bio: data.short_bio,
    full_bio: data.short_bio,
    coaching_history: data.coaching_history,
    intake_mode: data.intake_mode,
    packages: data.packages,
    athlete_capacity: data.athlete_capacity,
    starting_price: startingPrice,
    response_time: data.response_time,
    status: "pending",
  });

  if (error) return { error: error.message };
  redirect("/coach/dashboard?onboarding=complete");
}
