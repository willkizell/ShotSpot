"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendCoachSubmissionAlert } from "@/lib/email";
import type { CoachingHistoryEntry, CoachPackage, CoachLink } from "@/lib/types/coach";

export interface OnboardingData {
  full_name: string;
  organization: string;
  location: string;
  remote: boolean;
  events: string[];
  years_coaching: number;
  short_bio: string;
  coaching_history: CoachingHistoryEntry[];
  links: CoachLink[];
  intake_mode: "instant_join" | "application_required";
  packages: CoachPackage[];
  athlete_capacity: number;
  response_time: string;
  avatar_url?: string | null;
  banner_url?: string | null;
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
    links: data.links.filter((l) => l.url.trim()),
    intake_mode: data.intake_mode,
    packages: data.packages,
    athlete_capacity: data.athlete_capacity,
    starting_price: startingPrice,
    response_time: data.response_time,
    avatar_url: data.avatar_url ?? null,
    banner_url: data.banner_url ?? null,
    status: "pending",
  });

  if (error) return { error: error.message };

  // Notify admin — fire-and-forget, don't block the response
  sendCoachSubmissionAlert({
    coachName: data.full_name,
    coachEmail: user.email!,
    events: data.events,
    location: data.location,
  }).catch(() => {});

  return { success: true };
}
