import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type Attempt = {
  id: string;
  score: number | null;
  correct_count: number | null;
  wrong_count: number | null;
  submitted_at: string | null;
  aw_exams: { title: string } | { title: string }[] | null;
};
type Perf = { subject_id: string; chapter_id: string | null; attempted: number; correct: number };
type Named = { id: string; name_bn: string };

const card = "rounded-xl border border-line bg-surface p-4";
const fmt = (s: string) =>
  new Date(s).toLocaleString("bn-BD", { timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "short" });
const examTitle = (x: Attempt["aw_exams"]) =>
  (Array.isArray(x) ? x[0]?.title : x?.title) ?? "পরীক্ষা";
const pct = (c: number, t: number) => (t > 0 ? Math.round((c / t) * 100) : null);

async function setMode(formData: FormData) {
  "use server";
  const mode = String(formData.get("mode"));
  if (mode !== "admission" && mode !== "hsc") return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("aw_profiles").update({ preferred_mode: mode }).eq("id", user.id);
  revalidatePath("/dashboard");
}

function Notice({ name, heading, body }: { name: string; heading: string; body: string }) {
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
        <p className="text-muted">{name}</p>
        <h1 className="mt-1 text-2xl font-bold">{heading}</h1>
        <p className="mt-3 max-w-prose text-muted">{body}</p>
      </section>
    </main>
  );
}

export default async function DashboardPage() {
  const { supabase, user, profile } = await requireUser();

  if (!profile) {
    return (
      <Notice
        name={user.email ?? ""}
        heading="প্রোফাইল পাওয়া যায়নি"
        body="লগআউট করে আবার লগইন করুন। সমস্যা থাকলে অ্যাডমিনকে জানান।"
      />
    );
  }
  const name = profile.full_name || user.email || "";
  if (profile.status === "pending")
    return <Notice name={name} heading="অনুমোদনের অপেক্ষায়" body="অ্যাডমিন অনুমোদন দিলে এখানে সব কিছু খুলে যাবে।" />;
  if (profile.status === "rejected")
    return <Notice name={name} heading="আবেদন গৃহীত হয়নি" body="প্রয়োজনে অ্যাডমিনের সঙ্গে যোগাযোগ করুন।" />;
  if (profile.status === "suspended")
    return <Notice name={name} heading="অ্যাকাউন্ট স্থগিত" body="অ্যাডমিনের সঙ্গে যোগাযোগ করুন।" />;

  const [attemptsRes, countRes, perfRes, bookmarkRes, annRes, examsRes, subjectsRes, chaptersRes] =
    await Promise.all([
      supabase
        .from("aw_exam_attempts")
        .select("id, score, correct_count, wrong_count, submitted_at, aw_exams(title)")
        .eq("user_id", user.id)
        .eq("status", "submitted")
        .order("submitted_at", { ascending: false })
        .limit(50),
      supabase
        .from("aw_exam_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "submitted"),
      supabase.rpc("aw_my_chapter_performance"),
      supabase.from("aw_bookmarks").select("question_id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase
        .from("aw_announcements")
        .select("id, title, body, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("aw_exams")
        .select("id, title, start_at, end_at, duration_minutes")
        .eq("status", "published")
        .order("start_at", { ascending: true, nullsFirst: false })
        .limit(20),
      supabase.from("aw_subjects").select("id, name_bn").order("sort_order"),
      supabase.from("aw_chapters").select("id, name_bn"),
    ]);

  const attempts = (attemptsRes.data ?? []) as unknown as Attempt[];
  const perf = ((perfRes.data ?? []) as Perf[]).map((p) => ({
    ...p,
    attempted: Number(p.attempted),
    correct: Number(p.correct),
  }));
  const subjects = (subjectsRes.data ?? []) as Named[];
  const chapters = (chaptersRes.data ?? []) as Named[];

  const sumCorrect = attempts.reduce((a, x) => a + (x.correct_count ?? 0), 0);
  const sumWrong = attempts.reduce((a, x) => a + (x.wrong_count ?? 0), 0);
  const accuracy = pct(sumCorrect, sumCorrect + sumWrong);
  const scored = attempts.filter((x) => x.score !== null);
  const avgScore = scored.length ? scored.reduce((a, x) => a + Number(x.score), 0) / scored.length : null;

  const bySubject = subjects
    .map((s) => {
      const rows = perf.filter((p) => p.subject_id === s.id);
      const att = rows.reduce((a, r) => a + r.attempted, 0);
      const cor = rows.reduce((a, r) => a + r.correct, 0);
      return { id: s.id, name: s.name_bn, att, acc: pct(cor, att) };
    })
    .filter((s) => s.att > 0);

  const weak = perf
    .filter((p) => p.chapter_id && p.attempted >= 3 && (pct(p.correct, p.attempted) ?? 100) < 60)
    .map((p) => ({
      id: p.chapter_id as string,
      name: chapters.find((c) => c.id === p.chapter_id)?.name_bn ?? "অধ্যায়",
      acc: pct(p.correct, p.attempted) ?? 0,
      att: p.attempted,
    }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 5);

  const now = Date.now();
  const upcoming = ((examsRes.data ?? []) as { id: string; title: string; start_at: string | null; end_at: string | null; duration_minutes: number }[])
    .filter((e) => !e.end_at || new Date(e.end_at).getTime() > now)
    .slice(0, 3);

  const stat = "text-2xl font-bold";

  return (
    <AppShell role={profile.role}>
      <p className="text-muted">স্বাগতম</p>
      <h1 className="text-2xl font-bold">{name}</h1>

      <form action={setMode} className="mt-4 flex gap-2">
        {(
          [
            ["admission", "ভর্তি প্রস্তুতি"],
            ["hsc", "HSC প্রস্তুতি"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="submit"
            name="mode"
            value={m}
            className={
              profile.preferred_mode === m
                ? "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
                : "rounded-lg border border-line px-4 py-2 text-sm font-medium"
            }
          >
            {label}
          </button>
        ))}
      </form>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <div className={card}>
          <p className="text-sm text-muted">সম্পন্ন পরীক্ষা</p>
          <p className={stat}>{countRes.count ?? 0}</p>
        </div>
        <div className={card}>
          <p className="text-sm text-muted">গড় নম্বর</p>
          <p className={stat}>{avgScore === null ? "—" : avgScore.toFixed(1)}</p>
        </div>
        <div className={card}>
          <p className="text-sm text-muted">সঠিকতা</p>
          <p className={stat}>{accuracy === null ? "—" : `${accuracy}%`}</p>
        </div>
        <div className={card}>
          <p className="text-sm text-muted">বুকমার্ক</p>
          <p className={stat}>{bookmarkRes.count ?? 0}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">বিষয়ভিত্তিক সঠিকতা</h2>
        {bySubject.length === 0 ? (
          <p className="mt-2 text-sm text-muted">পরীক্ষা দিলে এখানে বিষয়ভিত্তিক ফলাফল দেখা যাবে।</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {bySubject.map((s) => (
              <li key={s.id}>
                <div className="flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="text-muted">{s.acc}% · {s.att}টি প্রশ্ন</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-line">
                  <div className="h-2 rounded-full bg-brand" style={{ width: `${s.acc ?? 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">দুর্বল অধ্যায়</h2>
        {weak.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            কোনো অধ্যায়ে অন্তত ৩টি প্রশ্নের উত্তর দিলে এবং সঠিকতা ৬০%-এর নিচে থাকলে এখানে দেখা যাবে।
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {weak.map((w) => (
              <li key={w.id} className={`${card} flex justify-between text-sm`}>
                <span>{w.name}</span>
                <span className="text-signal">{w.acc}% ({w.att}টি)</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">আসন্ন পরীক্ষা</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-muted">এখন কোনো পরীক্ষা নির্ধারিত নেই।</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {upcoming.map((e) => (
              <li key={e.id} className={card}>
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-muted">
                  {e.duration_minutes} মিনিট{e.start_at ? ` · শুরু ${fmt(e.start_at)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">সাম্প্রতিক ফলাফল</h2>
        {attempts.length === 0 ? (
          <p className="mt-2 text-sm text-muted">এখনো কোনো পরীক্ষা দেননি।</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {attempts.slice(0, 5).map((a) => (
              <li key={a.id} className={`${card} flex justify-between text-sm`}>
                <span>
                  {examTitle(a.aw_exams)}
                  <span className="block text-muted">{a.submitted_at ? fmt(a.submitted_at) : ""}</span>
                </span>
                <span className="font-semibold">{Number(a.score ?? 0).toFixed(1)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">ঘোষণা</h2>
        {(annRes.data ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted">কোনো নতুন ঘোষণা নেই।</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(annRes.data ?? []).map((a: { id: string; title: string; body: string }) => (
              <li key={a.id} className={card}>
                <p className="font-medium">{a.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{a.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
