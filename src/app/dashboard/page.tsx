import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("aw_profiles")
    .select("full_name, role, status")
    .eq("id", user.id)
    .maybeSingle();

  let heading = "আপনার অ্যাকাউন্ট চালু আছে";
  let body = "শিক্ষার্থী ড্যাশবোর্ডের বাকি অংশ পরের ধাপে যোগ হবে।";

  if (!profile) {
    heading = "প্রোফাইল পাওয়া যায়নি";
    body = "লগআউট করে আবার লগইন করুন। সমস্যা থাকলে অ্যাডমিনকে জানান।";
  } else if (profile.status === "pending") {
    heading = "অনুমোদনের অপেক্ষায়";
    body = "আপনার অ্যাকাউন্ট এখনো অনুমোদিত হয়নি। অ্যাডমিন অনুমোদন দিলে এখানে সব কিছু খুলে যাবে।";
  } else if (profile.status === "rejected") {
    heading = "আবেদন গৃহীত হয়নি";
    body = "আপনার রেজিস্ট্রেশন অনুমোদিত হয়নি। প্রয়োজনে অ্যাডমিনের সঙ্গে যোগাযোগ করুন।";
  } else if (profile.status === "suspended") {
    heading = "অ্যাকাউন্ট স্থগিত";
    body = "আপনার অ্যাকাউন্ট সাময়িকভাবে বন্ধ আছে। অ্যাডমিনের সঙ্গে যোগাযোগ করুন।";
  }

  const isAdmin = profile?.role === "admin" && profile?.status === "approved";

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <header className="flex items-center justify-between">
        <span className="text-lg font-bold">Admission Warrior</span>
        <form action="/auth/signout" method="post">
          <button type="submit" className="rounded-lg border border-line px-4 py-2 text-sm font-medium">
            লগআউট
          </button>
        </form>
      </header>

      <section className="mt-10">
        <p className="text-muted">{profile?.full_name || user.email}</p>
        <h1 className="mt-1 text-2xl font-bold">{heading}</h1>
        <p className="mt-3 max-w-prose text-muted">{body}</p>
        {isAdmin ? (
          <Link href="/admin" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-white">
            অ্যাডমিন প্যানেল
          </Link>
        ) : null}
      </section>
    </main>
  );
}
