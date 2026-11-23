"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError("পাসওয়ার্ড বদলানো যায়নি। ইমেইলের লিংক থেকে আবার ঢুকে চেষ্টা করুন।");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthCard title="নতুন পাসওয়ার্ড দিন">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)
          </label>
          <input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-base"
            autoComplete="new-password" required />
        </div>
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "অপেক্ষা করুন..." : "পাসওয়ার্ড সেভ করুন"}
        </button>
      </form>
    </AuthCard>
  );
}
