import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  full_name: string;
  role: "student" | "contributor" | "admin";
  status: "pending" | "approved" | "rejected" | "suspended";
  preferred_mode: "admission" | "hsc";
  daily_goal_minutes: number;
};

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data } = await supabase
    .from("aw_profiles")
    .select("id, full_name, role, status, preferred_mode, daily_goal_minutes")
    .eq("id", user.id)
    .maybeSingle();
  return { supabase, user, profile: data as Profile | null };
}

export async function requireApproved() {
  const { supabase, user, profile } = await requireUser();
  if (!profile || profile.status !== "approved") redirect("/dashboard");
  return { supabase, user, profile };
}

export async function requireStaff() {
  const { supabase, user, profile } = await requireApproved();
  if (profile.role !== "admin" && profile.role !== "contributor") redirect("/dashboard");
  return { supabase, user, profile };
}

export async function requireAdmin() {
  const { supabase, user, profile } = await requireApproved();
  if (profile.role !== "admin") redirect("/dashboard");
  return { supabase, user, profile };
}
