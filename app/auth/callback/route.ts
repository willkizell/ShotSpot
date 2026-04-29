import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = (searchParams.get("role") ?? "athlete") as UserRole;
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Upsert user record with role from OAuth callback
      await supabase.from("users").upsert({
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name ?? null,
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
        role,
      });

      if (role === "coach") {
        const { data: profile } = await supabase
          .from("coach_profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();
        const redirectPath = profile ? "/coach/dashboard" : "/coach/onboarding";
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
      return NextResponse.redirect(`${origin}/athlete/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
}
