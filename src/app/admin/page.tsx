import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import ConfirmButton from "@/components/ConfirmButton";

type Row = {
  id: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
};

const statusLabel: Record<string, string> = {
  pending: "অপেক্ষমাণ",
  approved: "অনুমোদিত",
  rejected: "প্রত্যাখ্যাত",
  suspended: "স্থগিত",
};
const roleLabel: Record<string, string> = {
  student: "শিক্ষার্থী",
  contributor: "কন্ট্রিবিউটর",
  admin: "অ্যাডমিন",
};

// আসল অনুমতি যাচাই করে ডাটাবেস ফাংশন; এই কোড শুধু ফাংশনটি ডাকে।
async function setStatus(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.rpc("aw_set_user_status", {
    p_user: String(formData.get("id")),
    p_status: String(formData.get("status")),
  });
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
}

async function setRole(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.rpc("aw_set_user_role", {
    p_user: String(formData.get("id")),
    p_role: String(formData.get("role")),
  });
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
}

const btn = "rounded-lg border border-line px-3 py-2 text-sm font-medium";
const btnMain = "rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white";

function StatusForm({ id, status, label, main, confirm }: {
  id: string; status: string; label: string; main?: boolean; confirm?: string;
}) {
  return (
    <form action={setStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      {confirm ? (
        <ConfirmButton message={confirm} className={btn}>{label}</ConfirmButton>
      ) : (
        <button type="submit" className={main ? btnMain : btn}>{label}</button>
      )}
    </form>
  );
}

function RoleForm({ id, role, label }: { id: string; role: string; label: string }) {
  return (
    <form action={setRole}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="role" value={role} />
      <ConfirmButton message={`${label}? নিশ্চিত করুন।`} className={btn}>{label}</ConfirmButton>
    </form>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("aw_profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();
  if (!me || me.role !== "admin" || me.status !== "approved") redirect("/dashboard");

  const { data } = await supabase
    .from("aw_profiles")
    .select("id, full_name, role, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as Row[];
  const pending = rows.filter((r) => r.status === "pending");
  const others = rows.filter((r) => r.status !== "pending");

  const date = (s: string) =>
    new Date(s).toLocaleDateString("bn-BD", { timeZone: "Asia/Dhaka" });

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <header className="flex items-center justify-between">
        <span className="text-lg font-bold">অ্যাডমিন প্যানেল</span>
        <Link href="/dashboard" className="text-sm font-semibold text-brand">ড্যাশবোর্ড</Link>
      </header>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-line p-3 text-sm text-red-600">
          কাজটি করা যায়নি: {error}
        </p>
      ) : null}

      <section className="mt-8">
        <h2 className="font-semibold">অনুমোদনের অপেক্ষায় ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted">কোনো নতুন আবেদন নেই।</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((r) => (
              <li key={r.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-medium">{r.full_name || "নাম নেই"}</p>
                <p className="text-sm text-muted">আবেদন: {date(r.created_at)}</p>
                <div className="mt-3 flex gap-2">
                  <StatusForm id={r.id} status="approved" label="অনুমোদন" main />
                  <StatusForm id={r.id} status="rejected" label="প্রত্যাখ্যান"
                    confirm="এই আবেদন প্রত্যাখ্যান করবেন?" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-semibold">সব ব্যবহারকারী ({others.length})</h2>
        {others.length === 0 ? (
          <p className="mt-3 text-sm text-muted">এখনো কেউ নেই।</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {others.map((r) => (
              <li key={r.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-medium">{r.full_name || "নাম নেই"}</p>
                <p className="text-sm text-muted">
                  {roleLabel[r.role] ?? r.role} · {statusLabel[r.status] ?? r.status} · {date(r.created_at)}
                </p>
                {r.id !== user.id ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.status === "approved" ? (
                      <StatusForm id={r.id} status="suspended" label="স্থগিত করুন"
                        confirm="এই ব্যবহারকারীর অ্যাকাউন্ট স্থগিত করবেন?" />
                    ) : (
                      <StatusForm id={r.id} status="approved" label="চালু করুন" main />
                    )}
                    {r.role === "student" ? (
                      <RoleForm id={r.id} role="contributor" label="কন্ট্রিবিউটর বানান" />
                    ) : null}
                    {r.role === "contributor" ? (
                      <RoleForm id={r.id} role="student" label="শিক্ষার্থী বানান" />
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
