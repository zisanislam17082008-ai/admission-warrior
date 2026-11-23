"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Subject = { id: string; name_bn: string };
type Chapter = { id: string; subject_id: string; name_bn: string };

const KINDS = [
  ["pdf", "PDF ফাইল"],
  ["note", "নোট"],
  ["formula_sheet", "সূত্র শিট"],
  ["video", "ভিডিও"],
  ["link", "বাইরের লিংক"],
  ["image", "ছবি"],
] as const;
const MIME: Record<string, string[]> = {
  pdf: ["application/pdf"],
  image: ["image/png", "image/jpeg", "image/webp"],
  video: ["video/mp4"],
};
const MAX_BYTES = 50 * 1024 * 1024;
const input = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-base";

export default function ContentForm({
  userId,
  isAdmin,
  subjects,
  chapters,
}: {
  userId: string;
  isAdmin: boolean;
  subjects: Subject[];
  chapters: Chapter[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<string>("pdf");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [mode, setMode] = useState("both");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const needsFile = kind === "pdf" || kind === "image";
  const allowsFile = needsFile || kind === "video";
  const needsBody = kind === "note" || kind === "formula_sheet";
  const needsUrl = kind === "link";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const t = title.trim();
    if (!t) return setMsg({ ok: false, text: "শিরোনাম লিখুন।" });
    if (!subjectId) return setMsg({ ok: false, text: "বিষয় বেছে নিন।" });
    if (needsBody && !body.trim()) return setMsg({ ok: false, text: "নোটের লেখা দিন।" });
    const link = url.trim();
    if ((needsUrl || link) && !/^https?:\/\//i.test(link))
      return setMsg({ ok: false, text: "লিংক http:// বা https:// দিয়ে শুরু হতে হবে।" });
    if (needsUrl && !link) return setMsg({ ok: false, text: "লিংক দিন।" });
    if (needsFile && !file) return setMsg({ ok: false, text: "একটি ফাইল বেছে নিন।" });
    if (kind === "video" && !file && !link)
      return setMsg({ ok: false, text: "ভিডিও ফাইল অথবা লিংক দিন।" });
    if (file && allowsFile) {
      if (!MIME[kind]?.includes(file.type))
        return setMsg({ ok: false, text: "এই ধরনের জন্য ফাইলের ফরম্যাট সঠিক নয়।" });
      if (file.size > MAX_BYTES) return setMsg({ ok: false, text: "ফাইল ৫০ MB-এর বেশি হতে পারবে না।" });
    }

    setBusy(true);
    const supabase = createClient();
    let path: string | null = null;

    if (file && allowsFile) {
      const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("aw-materials")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setBusy(false);
        return setMsg({ ok: false, text: "ফাইল আপলোড হয়নি। আপনার আপলোডের অনুমতি আছে কিনা অ্যাডমিনকে জিজ্ঞাসা করুন।" });
      }
    }

    const { error } = await supabase.from("aw_contents").insert({
      title: t.slice(0, 200),
      kind,
      subject_id: subjectId,
      chapter_id: chapterId || null,
      mode,
      description: description.trim() || null,
      body: needsBody ? body.trim() : null,
      storage_path: path,
      external_url: link || null,
      status: isAdmin ? status : "pending",
      created_by: userId,
    });
    setBusy(false);

    if (error) {
      if (path) await supabase.storage.from("aw-materials").remove([path]);
      return setMsg({ ok: false, text: "সংরক্ষণ করা যায়নি। আপনার অনুমতি অ্যাডমিনের কাছে যাচাই করুন।" });
    }
    setMsg({
      ok: true,
      text: isAdmin && status === "published" ? "প্রকাশিত হয়েছে।" : "জমা হয়েছে। অ্যাডমিন যাচাই করে প্রকাশ করবেন।",
    });
    setTitle("");
    setDescription("");
    setBody("");
    setUrl("");
    setFile(null);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-line bg-surface p-4">
      <h2 className="font-semibold">নতুন কনটেন্ট</h2>

      <label className="block text-sm font-medium">
        শিরোনাম
        <input className={`${input} mt-1`} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
      </label>

      <label className="block text-sm font-medium">
        ধরন
        <select className={`${input} mt-1`} value={kind} onChange={(e) => { setKind(e.target.value); setFile(null); }}>
          {KINDS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        বিষয়
        <select className={`${input} mt-1`} value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setChapterId(""); }}>
          <option value="">বেছে নিন</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name_bn}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        অধ্যায় (ঐচ্ছিক)
        <select className={`${input} mt-1`} value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
          <option value="">সব অধ্যায়ের জন্য</option>
          {chapters.filter((c) => c.subject_id === subjectId).map((c) => (
            <option key={c.id} value={c.id}>{c.name_bn}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        কোন প্রস্তুতির জন্য
        <select className={`${input} mt-1`} value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="both">ভর্তি ও HSC দুটোতেই</option>
          <option value="admission">শুধু ভর্তি</option>
          <option value="hsc">শুধু HSC</option>
        </select>
      </label>

      {allowsFile ? (
        <label className="block text-sm font-medium">
          ফাইল (সর্বোচ্চ ৫০ MB)
          <input
            type="file"
            className={`${input} mt-1`}
            accept={(MIME[kind] ?? []).join(",")}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      ) : null}

      {kind === "video" || needsUrl ? (
        <label className="block text-sm font-medium">
          লিংক {kind === "video" ? "(ফাইল না দিলে)" : ""}
          <input className={`${input} mt-1`} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" inputMode="url" />
        </label>
      ) : null}

      {needsBody ? (
        <label className="block text-sm font-medium">
          লেখা
          <textarea className={`${input} mt-1 min-h-40`} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
      ) : null}

      <label className="block text-sm font-medium">
        সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
        <textarea className={`${input} mt-1`} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
      </label>

      {isAdmin ? (
        <label className="block text-sm font-medium">
          অবস্থা
          <select className={`${input} mt-1`} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">খসড়া</option>
            <option value="published">এখনই প্রকাশ</option>
          </select>
        </label>
      ) : (
        <p className="text-sm text-muted">জমা দিলে অ্যাডমিন যাচাই করে প্রকাশ করবেন।</p>
      )}

      {msg ? (
        <p role="alert" className={`text-sm ${msg.ok ? "text-brand" : "text-red-600"}`}>{msg.text}</p>
      ) : null}

      <button type="submit" disabled={busy} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">
        {busy ? "অপেক্ষা করুন..." : "সংরক্ষণ করুন"}
      </button>
    </form>
  );
}
