import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export default async function CoachDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userData?.role === "athlete") redirect("/athlete/dashboard");

  return (
    <div className="min-h-screen bg-[#D7D7D7] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-4xl tracking-tight"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            COACH DASHBOARD
          </h1>
          <form action={signOut}>
            <button
              type="submit"
              className="border-2 border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-[#D7D7D7] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="border-2 border-black p-6 mb-4">
          <p className="text-sm text-black/50 uppercase tracking-wider mb-1">Signed in as</p>
          <p className="font-semibold">{userData?.full_name ?? user.email}</p>
          <p className="text-sm text-black/60">{user.email}</p>
        </div>

        <div className="border-2 border-black border-dashed p-8 text-center text-black/40">
          <p className="text-sm">Coach dashboard — built out in Phase 8</p>
        </div>
      </div>
    </div>
  );
}
