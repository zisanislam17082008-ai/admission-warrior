import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AppShell from "@/components/AppShell";
import ConfirmButton from "@/components/ConfirmButton";
import { requireAdmin } from "@/lib/auth";

const MODES = ["both", "admission", "hsc"];
const modeLabel: Record<string, string> = { both: "দুটোতেই", admission: "ভর্তি", hsc: "HSC" };
const input = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-base";
const btn = "rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white";
const btnLine = "rounded-lg border border-line px-3 py-1.5 text-xs font-medium";

function fail(message: string): never {
  redirect(`/admin/subjects?error=${encodeURIComponent(message)}`);
}
function done(error: { message: string } | null) {
  if (error) fail(error.message);
  revalidatePath("/admin/subjects");
}

async function addChapter(fd: FormData) {
  "use server";
  const { supabase } = await requireAdmin();
  const name = String(fd.get("name_bn") ?? "").trim().slice(0, 150);
  const mode = String(fd.get("mode") ?? "both");
  if (!name || !MODES.includes(mode)) fail("অধ্যায়ের সঠিক নাম দিন।");
  const { error } = await supabase.from("aw_chapters").insert({
    subject_id: String(fd.get("subject_id")),
    name_bn: name,
    name_en: String(fd.get("name_en") ?? "").trim().slice(0, 150) || null,
    mode,
  });
  done(error);
}

async function addTopic(fd: FormData) {
  "use server";
  const { supabase } = await requireAdmin();
  const name = String(fd.get("name_bn") ?? "").trim().slice(0, 150);
  if (!name) fail("টপিকের নাম দিন।");
  const { error } = await supabase
    .from("aw_topics")
    .insert({ chapter_id: String(fd.get("chapter_id")), name_bn: name });
  done(error);
}

async function deleteChapter(fd: FormData) {
  "use server";
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("aw_chapters").delete().eq("id", String(fd.get("id")));
  done(error);
}

async function deleteTopic(fd: FormData) {
  "use server";
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("aw_topics").delete().eq("id", String(fd.get("id")));
  done(error);
}

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase, profile } = await requireAdmin();

  const [s, c, t] = await Promise.all([
    supabase.from("aw_subjects").select("id, name_bn, name_en").order("sort_order"),
    supabase.from("aw_chapters").select("id, subject_id, name_bn, mode").order("sort_order").order("name_bn"),
    supabase.from("aw_topics").select("id, chapter_id, name_bn").order("sort_order").order("name_bn"),
  ]);
  const subjects = (s.data ?? []) as { id: string; name_bn: string; name_en: string }[];
  const chapters = (c.data ?? []) as { id: string; subject_id: string; name_bn: string; mode: string }[];
  const topics = (t.data ?? []) as { id: string; chapter_id: string; name_bn: string }[];

  return (
    <AppShell role={profile.role}>
      <h1 className="text-xl font-bold">বিষয়, অধ্যায় ও টপিক</h1>
      <p className="mt-1 text-sm text-muted">
        অধ্যায় মুছতে গেলে সেই অধ্যায়ে প্রশ্ন থাকলে মোছা যাবে না।
      </p>
      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-line p-3 text-sm text-red-600">
          কাজটি করা যায়নি: {error}
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {subjects.map((subj) => {
          const chs = chapters.filter((x) => x.subject_id === subj.id);
          return (
            <details key={subj.id} className="rounded-xl border border-line bg-surface p-4" open={chs.length === 0}>
              <summary className="cursor-pointer font-semibold">
                {subj.name_bn} <span className="text-sm font-normal text-muted">({chs.length}টি অধ্যায়)</span>
              </summary>

              <ul className="mt-4 space-y-4">
                {chs.map((ch) => (
                  <li key={ch.id} className="rounded-lg border border-line p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">
                        {ch.name_bn} <span className="text-xs text-muted">· {modeLabel[ch.mode]}</span>
                      </p>
                      <form action={deleteChapter}>
                        <input type="hidden" name="id" value={ch.id} />
                        <ConfirmButton message="এই অধ্যায় ও এর সব টপিক মুছে ফেলবেন?" className={btnLine}>
                          মুছুন
                        </ConfirmButton>
                      </form>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {topics
                        .filter((x) => x.chapter_id === ch.id)
                        .map((tp) => (
                          <li key={tp.id} className="flex items-center justify-between text-sm">
                            <span>• {tp.name_bn}</span>
                            <form action={deleteTopic}>
                              <input type="hidden" name="id" value={tp.id} />
                              <ConfirmButton message="এই টপিক মুছে ফেলবেন?" className={btnLine}>
                                মুছুন
                              </ConfirmButton>
                            </form>
                          </li>
                        ))}
                    </ul>
                    <form action={addTopic} className="mt-3 flex gap-2">
                      <input type="hidden" name="chapter_id" value={ch.id} />
                      <input name="name_bn" placeholder="নতুন টপিক" className={input} maxLength={150} required />
                      <button type="submit" className={btn}>যোগ</button>
                    </form>
                  </li>
                ))}
              </ul>

              <form action={addChapter} className="mt-5 space-y-2 border-t border-line pt-4">
                <p className="text-sm font-medium">নতুন অধ্যায়</p>
                <input type="hidden" name="subject_id" value={subj.id} />
                <input name="name_bn" placeholder="অধ্যায়ের নাম (বাংলা)" className={input} maxLength={150} required />
                <input name="name_en" placeholder="Chapter name (optional)" className={input} maxLength={150} />
                <select name="mode" className={input} defaultValue="both">
                  <option value="both">ভর্তি ও HSC দুটোতেই</option>
                  <option value="admission">শুধু ভর্তি</option>
                  <option value="hsc">শুধু HSC</option>
                </select>
                <button type="submit" className={btn}>অধ্যায় যোগ করুন</button>
              </form>
            </details>
          );
        })}
      </div>
    </AppShell>
  );
}
