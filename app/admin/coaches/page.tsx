import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminCoachList } from "./AdminCoachList";
import { getAllCoaches } from "@/lib/admin/actions";

export default async function AdminCoachesPage() {
  // Server-side admin guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (userData?.role !== "admin") redirect("/");

  const coaches = await getAllCoaches();

  return (
    <div className="min-h-screen bg-[#D7D7D7]">
      <div className="border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-xl tracking-tight font-bold" style={{ fontFamily: "var(--font-anton)" }}>
              <span>SHOT</span><span className="text-[#007B6F]">SPOT</span>
              <span className="text-black/30 ml-3 text-sm font-normal">Admin</span>
            </span>
          </div>
          <p className="text-xs text-black/40">
            {coaches.filter((c) => c.status === "pending").length} pending review
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AdminCoachList coaches={coaches} />
      </div>
    </div>
  );
}
