import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import Link from "next/link";

export default async function SettingsPage() {
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

  const dashboardPath =
    userData?.role === "coach" ? "/coach/dashboard" : "/athlete/dashboard";

  return (
    <div className="min-h-screen bg-[#D7D7D7] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={dashboardPath}
            className="text-sm text-black/50 hover:text-black transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        <h1
          className="text-4xl tracking-tight mb-8"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          SETTINGS
        </h1>

        <div className="border-2 border-black p-6 mb-4 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider">Account</h2>
          <div>
            <p className="text-xs text-black/50 uppercase tracking-wider mb-0.5">Name</p>
            <p className="font-medium">{userData?.full_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-black/50 uppercase tracking-wider mb-0.5">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-black/50 uppercase tracking-wider mb-0.5">Role</p>
            <p className="font-medium capitalize">{userData?.role}</p>
          </div>
        </div>

        <div className="border-2 border-black border-dashed p-6 mb-6 text-center text-black/40">
          <p className="text-sm">Full account settings — built out in later phases</p>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="border-2 border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-[#D7D7D7] transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
