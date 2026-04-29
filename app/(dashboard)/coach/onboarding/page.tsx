import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function CoachOnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // If they already have a profile, skip onboarding
  const { data: profile } = await supabase
    .from("coach_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) redirect("/coach/dashboard");

  // Pre-fill name from signup
  const fullName = user.user_metadata?.full_name ?? "";

  return <OnboardingWizard initialName={fullName} />;
}
