import { createClient } from "@/lib/supabase/server";
import type { CoachCardData } from "@/components/ui/CoachCard";
import { MOCK_COACHES } from "@/lib/mock/coaches";

export async function getMarketplaceCoaches(): Promise<CoachCardData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coach_profiles")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return MOCK_COACHES;

    return data.map((row) => ({
      id: row.id,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      location: row.location ?? "",
      remote: row.remote,
      headline: row.short_bio ?? "",
      organization: row.organization,
      events: row.events ?? [],
      years_coaching: row.years_coaching ?? 0,
      intake_mode: row.intake_mode,
      starting_price: row.starting_price ?? 0,
      billing_cadence: row.billing_cadence ?? "monthly",
      availability: row.availability,
      athlete_count: row.athlete_count ?? 0,
      athlete_capacity: row.athlete_capacity ?? 20,
      response_time: row.response_time ?? "48hr",
      proof_tags: row.proof_tags ?? [],
      has_elite_athletes: row.has_elite_athletes ?? false,
    }));
  } catch {
    return MOCK_COACHES;
  }
}

export async function getCoachProfile(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coach_profiles")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}
