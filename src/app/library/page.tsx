import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireApproved } from "@/lib/auth";

const kindLabel: Record<string, string> = {
  pdf: "PDF", note: "নোট", formula_sheet: "সূত্র শিট", video: "ভিডিও", link: "লিংক", image: "ছবি",
};
const input = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-base";

type Row = {
  id: string;
  title: string;
  kind: string;
  created_at: string;
  view_count: number;
  aw_subjects: { name_bn: string } | { name_bn: string }[] | null;
};
const subjName = (x: Row["aw_subjects"]) => (Array.isArray(x) ? x[0]?.name_bn : x?.name_bn) ?? "";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string; kind?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const { supabase, profile } = await requireApproved();

  const q = (sp.q ?? "").replace(/[%_,()]/g, " ").trim().slice(0, 80);
  const subject = sp.subject ?? "";
  const kind = sp.kind ?? "";
  const sort = sp.sort === "popular" ? "popular" : "new";

  let query = supabase
    .from("aw_contents")
    .select("id, title, kind, created_at, view_count, aw_subjects(name_bn)")
    .eq("status", "published");
  if (/^[0-9a-f-]{36}$/i.test(subject)) query = query.eq("subject_id", subject);
  if (kind in kindLabel) query = query.eq("kind", kind);
  if (q) query = query.ilike("title", `%${q}%`);
  query =
    sort === "popular"
      ? query.order("view_count", { ascending: false })
      : query.order("created_at", { ascending: false });

  const [res, subs] = await Promise.all([
    query.limit(60),
    supabase.from("aw_subjects").select("id, name_bn").order("sort_order"),
  ]);
  const rows = (res.data ?? []) as unknown as Row[];

  return (
    <AppShell role={profile.role}>
      <h1 className="text-xl font-bold">লাইব্রেরি</h1>

      <form method="get" className="mt-4 space-y-2">
        <input name="q" defaultValue={q} placeholder="শিরোনাম খুঁজুন" className={input} />
        <div className="grid grid-cols-2 gap-2">
          <select name="subject" defaultValue={subject} className={input}>
            <option value="">সব বিষয়</option>
            {(subs.data ?? []).map((s: { id: string; name_bn: string }) => (
              <option key={s.id} value={s.id}>{s.name_bn}</option>
            ))}
          </select>
          <select name="kind" defaultValue={kind} className={input}>
            <option value="">সব ধরন</option>
            {Object.entries(kindLabel).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <select name="sort" defaultValue={sort} className={input}>
          <option value="new">নতুন আগে</option>
          <option value="popular">জনপ্রিয় আগে</option>
        </select>
        <button type="submit" className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white">খুঁজুন</button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted">কোনো কনটেন্ট পাওয়া যায়নি।</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/library/${r.id}`} className="block rounded-xl border border-line bg-surface p-4">
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {kindLabel[r.kind] ?? r.kind} · {subjName(r.aw_subjects)} ·{" "}
                  {new Date(r.created_at).toLocaleDateString("bn-BD", { timeZone: "Asia/Dhaka" })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
