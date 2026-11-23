import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { requireApproved } from "@/lib/auth";

const safeUrl = (u: string | null) => (u && /^https?:\/\//i.test(u) ? u : null);

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase, profile } = await requireApproved();

  const { data: c } = await supabase
    .from("aw_contents")
    .select("id, title, kind, description, body, storage_path, external_url, status, created_at, aw_subjects(name_bn)")
    .eq("id", id)
    .maybeSingle();
  if (!c) notFound();

  if (c.status === "published") await supabase.rpc("aw_record_view", { p_content: id });

  let fileUrl: string | null = null;
  if (c.storage_path) {
    const { data } = await supabase.storage.from("aw-materials").createSignedUrl(c.storage_path, 3600);
    fileUrl = data?.signedUrl ?? null;
  }
  const link = safeUrl(c.external_url);
  const openBtn = "inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-white";

  return (
    <AppShell role={profile.role}>
      <Link href="/library" className="text-sm font-semibold text-brand">← লাইব্রেরি</Link>
      <h1 className="mt-3 text-2xl font-bold">{c.title}</h1>
      {c.status !== "published" ? (
        <p className="mt-2 text-sm text-signal">এটি এখনো প্রকাশিত নয়, শুধু আপনি দেখতে পাচ্ছেন।</p>
      ) : null}
      {c.description ? <p className="mt-3 text-muted">{c.description}</p> : null}

      <div className="mt-6 space-y-4">
        {(c.kind === "note" || c.kind === "formula_sheet") && c.body ? (
          <div className="whitespace-pre-wrap rounded-xl border border-line bg-surface p-4 leading-relaxed">{c.body}</div>
        ) : null}

        {c.kind === "pdf" && fileUrl ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={openBtn}>PDF খুলুন</a>
        ) : null}

        {c.kind === "image" && fileUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fileUrl} alt={c.title} className="max-w-full rounded-xl border border-line" />
        ) : null}

        {c.kind === "video" && fileUrl ? (
          <video controls preload="metadata" src={fileUrl} className="w-full rounded-xl" />
        ) : null}

        {(c.kind === "video" || c.kind === "link") && link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className={openBtn}>লিংক খুলুন</a>
        ) : null}

        {c.storage_path && !fileUrl ? (
          <p className="text-sm text-red-600">ফাইলটি খোলা যায়নি। একটু পরে আবার চেষ্টা করুন।</p>
        ) : null}
      </div>
    </AppShell>
  );
}
