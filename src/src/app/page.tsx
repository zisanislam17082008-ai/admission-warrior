
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl py-20">
        <h1 className="text-4xl font-bold text-cyan-300">
          Admission Warrior
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          তোমার বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির বিশ্বস্ত সঙ্গী।
        </p>
        <div className="mt-8 flex gap-4">
          <a href="/login" className="rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950">
            Login
          </a>
          <a href="/register" className="rounded-lg border border-slate-500 px-5 py-3">
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
