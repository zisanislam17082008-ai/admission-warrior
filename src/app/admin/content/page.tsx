import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AppShell from "@/components/AppShell";
import ConfirmButton from "@/components/ConfirmButton";
import ContentForm from "@/components/ContentForm";
import { requireStaff } from "@/lib/auth";

const STATUSES = ["draft", "pending", "published", "archived"];
const statusLabel: Record<string, string> = {
  draft: "খসড়া",
  pending: "যাচাইয়ের অপেক্ষায়",
  published: "প্রকাশিত",
  archived: "আর্কাইভ",
};
const kindLabel: Record<string, string> = {
  pdf: "PDF", note: "নোট", formula_sheet: "সূত্র শিট", video: "ভিডিও", link: "লিংক", image: "ছবি",
};
const btn = "rounded-lg border border-line px-3 py-1.5 text-xs font-medium";

type Row = {
  id: string;
  title: string;
  kind: string;
  status: string;
  created_at: string;
  aw_subjects: { name_bn: string } | { name_bn: string }[] | null;
};
const subjName = (x: Row["aw_subjects"]) => (Array.isArray(x) ? x[0]?.name_bn : x?.name_bn) ?? "";

function fail(message: string): never {
  redirect(`/admin/content?error=${encodeURIComponent(message)}`);
}

async function setStatus(fd: FormData) {
  "use server";
  const { supabase, profile } = await requireStaff();
  if (profile.role !== "admin") fail("শুধু অ্যাডমিন প্রকাশ বা আর্কাইভ করতে পারেন।");
  const status = String(fd.get("status"));
  if (!STATUSES.includes(status)) return;
  const { data, error } = await supabase
    .from("aw_contents")
    .update({ status })
    .eq("id", String(fd.get("id")))
    .select("id");
  if (error || !data?.length) fail(error?.message ?? "পরিবর্তন করা যায়নি।");
  revalidatePath("/admin/content");
}

async function removeContent(fd: FormData) {
  "use server";
  const { supabase } = await requireStaff();
  const id = String(fd.get("id"));
  const { data: row } = await supabase.from("aw_contents").select("storage_path").eq("id", id).maybeSingle();
  const { data, error } = await supabase.from("aw_contents").delete().eq("id", id).select("id");
  if (error || !data?.length) fail(error?.message ?? "মোছা যায়নি। প্রকাশিত কনটেন্ট শুধু অ্যাডমিন মুছতে পারেন।");
  if (row?.storage_path) await supabase.storage.from("aw-materials").remove([row.storage_path]);
  revalidatePath("/admin/content");
}

export default async function ContentAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase, user, profile } = await requireStaff();
  const isAdmin = profile.role === "admin";

  const [s, c, k] = await Promise.all([
    supabase.from("aw_subjects").select("id, name_bn").order("sort_order"),
    supabase.from("aw_chapters").select("id, subject_id, name_bn").order("sort_order"),
    supabase
      .from("aw_contents")
      .select("id, title, kind, status, created_at, aw_subjects(name_bn)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);
  const rows = (k.data ?? []) as unknown as Row[];

  return (
    <AppShell role={profile.role}>
      <h1 className="text-xl font-bold">কনটেন্ট ব্যবস্থাপনা</h1>
      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-line p-3 text-sm text-red-600">
          কাজটি করা যায়নি: {error}
        </p>
      ) : null}

      <div className="mt-5">
        <ContentForm
          userId={user.id}
          isAdmin={isAdmin}
          subjects={(s.data ?? []) as { id: string; name_bn: string }[]}
          chapters={(c.data ?? []) as { id: string; subject_id: string; name_bn: string }[]}
        />
      </div>

      <section className="mt-8">
        <h2 className="font-semibold">{isAdmin ? "সব কনটেন্ট" : "আপনার জমা দেওয়া কনটেন্ট"} ({rows.length})</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-muted">এখনো কিছু যোগ করা হয়নি।</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-muted">
                  {kindLabel[r.kind] ?? r.kind} · {subjName(r.aw_subjects)} · {statusLabel[r.status] ?? r.status}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isAdmin && r.status !== "published" ? (
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="published" />
                      <button type="submit" className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white">প্রকাশ করুন</button>
                    </form>
                  ) : null}
                  {isAdmin && r.status === "published" ? (
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="archived" />
                      <ConfirmButton message="এটি আর্কাইভ করলে শিক্ষার্থীরা আর দেখতে পারবে না। করবেন?" className={btn}>আর্কাইভ</ConfirmButton>
                    </form>
                  ) : null}
                  <form action={removeContent}>
                    <input type="hidden" name="id" value={r.id} />
                    <ConfirmButton message="এটি স্থায়ীভাবে মুছে ফেলবেন?" className={btn}>মুছুন</ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
