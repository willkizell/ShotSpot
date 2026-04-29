"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (data?.role !== "admin") redirect("/");
  return supabase;
}

export async function approveCoach(coachId: string) {
  const supabase = await requireAdmin();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("coach_profiles")
    .update({
      status: "approved",
      reviewed_by: user!.id,
      reviewed_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    })
    .eq("id", coachId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function rejectCoach(coachId: string, reason: string) {
  const supabase = await requireAdmin();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("coach_profiles")
    .update({
      status: "rejected",
      reviewed_by: user!.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq("id", coachId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getPendingCoaches() {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("coach_profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getAllCoaches() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("coach_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
