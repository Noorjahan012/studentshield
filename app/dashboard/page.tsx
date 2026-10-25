"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setName(data.user.user_metadata?.full_name || data.user.email || "Student");
        setReady(true);
      }
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!ready) {
    return <main className="p-10 text-slate-600">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="text-xl font-bold text-blue-700">🛡️ StudentShield</div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
        >
          Log out
        </button>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold">Welcome, {name} 👋</h1>
        <p className="mt-2 text-slate-600">Your safety dashboard. Lessons and tools are coming soon.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">XP points</div>
            <div className="text-3xl font-bold text-blue-700">0</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">Lessons done</div>
            <div className="text-3xl font-bold text-blue-700">0</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">Badges</div>
            <div className="text-3xl font-bold text-blue-700">0</div>
          </div>
        </div>
      </section>
    </main>
  );
}