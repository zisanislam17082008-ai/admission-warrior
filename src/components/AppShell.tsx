import Link from "next/link";

const link = "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium";

export default function AppShell({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const staff = role === "admin" || role === "contributor";
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link href="/dashboard" className="font-bold">
            Admission Warrior
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium">
              লগআউট
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-3 pb-2">
          <Link href="/dashboard" className={link}>ড্যাশবোর্ড</Link>
          <Link href="/library" className={link}>লাইব্রেরি</Link>
          {staff ? <Link href="/admin/content" className={link}>কনটেন্ট</Link> : null}
          {role === "admin" ? (
            <>
              <Link href="/admin" className={link}>ব্যবহারকারী</Link>
              <Link href="/admin/subjects" className={link}>অধ্যায়</Link>
              <Link href="/admin/contributors" className={link}>কন্ট্রিবিউটর</Link>
            </>
          ) : null}
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-6">{children}</main>
    </div>
  );
}
