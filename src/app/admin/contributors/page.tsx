import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AppShell from "@/components/AppShell";
import { requireAdmin } from "@/lib/auth";

const PERMS = [
  ["upload_content", "কনটেন্ট আপলোড"],
  ["add_questions", "প্রশ্ন যোগ"],
  ["create_exams", "পরীক্ষা তৈরি"],
] as const;

async function setPerm(fd: FormData) {
  "use server";
  const { supabase, user } = await requireAdmin();
  const uid = String(fd.get("user_id"));
  const perm = String(fd.get("perm"));
  const on = String(fd.get("on")) === "1";
  if (!PERMS.some((p) => p[0] === perm)) return;
  const { error } = on
    ? await supabase
        .from("aw_contributor_permissions")
        .upsert({ user_id: uid, permission: perm, granted_by: user.id }, { onConflict: "user_id,permission" })
    : await supabase.from("aw_contributor_permissions").delete().eq("user_id", uid).eq("permission", perm);
  if (error) redirect(`/admin/contributors?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/contributors");
}

export default async function ContributorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase, profile } = await requireAdmin();

  const [p, c] = await Promise.all([
    supabase.from("aw_profiles").select("id, full_name, status").eq("role", "contributor").order("created_at"),
    supabase.from("aw_contributor_permissions").select("user_id, permission"),
  ]);
  const people = (p.data ?? []) as { id: string; full_name: string; status: string }[];
  const granted = (c.data ?? []) as { user_id: string; permission: string }[];

  return (
    <AppShell role={profile.role}>
      <h1 className="text-xl font-bold">কন্ট্রিবিউটরের অনুমতি</h1>
      <p className="mt-1 text-sm text-muted">
        কন্ট্রিবিউটর শুধু এখানে চালু করা কাজই করতে পারে, এবং তার জমা দেওয়া কিছু নিজে প্রকাশ করতে পারে না।
      </p>
      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-line p-3 text-sm text-red-600">
          কাজটি করা যায়নি: {error}
        </p>
      ) : null}

      {people.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          এখনো কোনো কন্ট্রিবিউটর নেই। ব্যবহারকারী পাতা থেকে একজন অনুমোদিত শিক্ষার্থীকে কন্ট্রিবিউটর বানান।
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {people.map((u) => (
            <li key={u.id} className="rounded-xl border border-line bg-surface p-4">
              <p className="font-medium">{u.full_name || "নাম নেই"}</p>
              {u.status !== "approved" ? (
                <p className="text-sm text-signal">অ্যাকাউন্ট অনুমোদিত নয়, তাই অনুমতি কাজ করবে না।</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {PERMS.map(([key, label]) => {
                  const has = granted.some((g) => g.user_id === u.id && g.permission === key);
                  return (
                    <form key={key} action={setPerm}>
                      <input type="hidden" name="user_id" value={u.id} />
                      <input type="hidden" name="perm" value={key} />
                      <input type="hidden" name="on" value={has ? "0" : "1"} />
                      <button
                        type="submit"
                        className={
                          has
                            ? "rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
                            : "rounded-lg border border-line px-3 py-2 text-sm font-medium"
                        }
                      >
                        {has ? "✓ " : ""}
                        {label}
                      </button>
                    </form>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
