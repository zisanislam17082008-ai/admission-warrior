"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-base";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (fullName.trim().length < 2) {
      setError("আপনার পুরো নাম লিখুন।");
      return;
    }
    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (err) {
      setError(
        err.message.toLowerCase().includes("already")
          ? "এই ইমেইলে আগেই অ্যাকাউন্ট আছে। লগইন করুন।"
          : "রেজিস্ট্রেশন করা যায়নি। ইমেইল ও পাসওয়ার্ড দেখে আবার চেষ্টা করুন।"
      );
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <AuthCard title="ইমেইল চেক করুন">
        <p className="text-muted">
          আমরা {email} ঠিকানায় একটি লিংক পাঠিয়েছি। লিংকে ট্যাপ করে ইমেইল ভেরিফাই করুন।
          এরপর অ্যাডমিন অনুমোদন দিলে আপনার অ্যাকাউন্ট চালু হবে।
        </p>
        <Link href="/login" className="mt-6 inline-block font-semibold text-brand">
          লগইন পাতায় যান
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="নতুন অ্যাকাউন্ট" subtitle="অ্যাডমিন অনুমোদনের পর অ্যাকাউন্ট চালু হবে।">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">পুরো নাম</label>
          <input id="name" className={inputClass} value={fullName}
            onChange={(e) => setFullName(e.target.value)} autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">ইমেইল</label>
          <input id="email" type="email" className={inputClass} value={email}
            onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)
          </label>
          <input id="password" type="password" className={inputClass} value={password}
            onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
        </div>
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "অপেক্ষা করুন..." : "রেজিস্টার করুন"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="font-semibold text-brand">লগইন</Link>
      </p>
    </AuthCard>
  );
}
