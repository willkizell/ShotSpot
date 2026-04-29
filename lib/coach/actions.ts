"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CoachingHistoryEntry } from "@/lib/types/coach";

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
  athlete_capacity: number;
  starting_price: number;
  billing_cadence: "monthly" | "weekly" | "one_time";
  response_time: string;
}

export async function submitCoachProfile(data: OnboardingData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

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
    athlete_capacity: data.athlete_capacity,
    starting_price: data.starting_price,
    billing_cadence: data.billing_cadence,
    response_time: data.response_time,
    status: "pending",
  });

  if (error) return { error: error.message };
  redirect("/coach/dashboard?onboarding=complete");
}
