"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard title="ইমেইল চেক করুন">
        <p className="text-muted">
          এই ইমেইলে অ্যাকাউন্ট থাকলে পাসওয়ার্ড বদলানোর লিংক পাঠানো হয়েছে।
        </p>
        <Link href="/login" className="mt-6 inline-block font-semibold text-brand">লগইন পাতায় ফিরুন</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="পাসওয়ার্ড রিসেট" subtitle="আপনার ইমেইল লিখুন। আমরা একটি লিংক পাঠাব।">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">ইমেইল</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-base"
            autoComplete="email" required />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "অপেক্ষা করুন..." : "লিংক পাঠান"}
        </button>
      </form>
    </AuthCard>
  );
}
