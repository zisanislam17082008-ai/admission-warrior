"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-base";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (err) {
      const m = err.message.toLowerCase();
      setError(
        m.includes("not confirmed")
          ? "আগে ইমেইলের লিংকে ট্যাপ করে ভেরিফাই করুন।"
          : "ইমেইল বা পাসওয়ার্ড ভুল।"
      );
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthCard title="লগইন">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">ইমেইল</label>
          <input id="email" type="email" className={inputClass} value={email}
            onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">পাসওয়ার্ড</label>
          <input id="password" type="password" className={inputClass} value={password}
            onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "অপেক্ষা করুন..." : "লগইন করুন"}
        </button>
      </form>
      <div className="mt-6 flex justify-between text-sm">
        <Link href="/forgot-password" className="font-semibold text-brand">পাসওয়ার্ড ভুলে গেছেন?</Link>
        <Link href="/register" className="font-semibold text-brand">নতুন অ্যাকাউন্ট</Link>
      </div>
    </AuthCard>
  );
}
