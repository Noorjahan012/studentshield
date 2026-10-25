"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

type Lesson = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  icon: string;
  xp: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [doneIds, setDoneIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setName(data.user.user_metadata?.full_name || data.user.email || "Student");

      const { data: lessonData } = await supabase
        .from("lessons")
        .select("id, slug, title, summary, icon, xp")
        .order("id");
    setLessons(lessonData || []);
      const { data: progressData } = await supabase
  .from("lesson_progress")
  .select("lesson_id");
   setDoneIds((progressData || []).map((p) => p.lesson_id));
      setReady(true);
    }

    load();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }
const doneLessons = lessons.filter((l) => doneIds.includes(l.id));
const totalXp = doneLessons.reduce((sum, l) => sum + l.xp, 0);
const badgeCount =
  (doneLessons.length >= 1 ? 1 : 0) +
  (doneLessons.length >= 3 ? 1 : 0) +
  (doneLessons.length >= lessons.length && lessons.length > 0 ? 1 : 0);
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

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold">Welcome, {name} 👋</h1>
        <p className="mt-2 text-slate-600">Pick a lesson and learn how to stay safe online.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">XP points</div>
            <div className="text-3xl font-bold text-blue-700">{totalXp}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">Lessons done</div>
            <div className="text-3xl font-bold text-blue-700">{doneLessons.length} / {lessons.length}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">Badges</div>
            <div className="text-3xl font-bold text-blue-700">{badgeCount}</div>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Safety lessons</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l) => (
            <a
              key={l.id}
              href={`/lessons/${l.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400 hover:shadow-md"
            >
              <div className="text-3xl">{l.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{l.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{l.summary}</p>
              <div className="mt-4 text-sm font-semibold text-blue-700">+{l.xp} XP →</div>
            </a>
          ))}
        </div>

        {lessons.length === 0 && (
          <p className="mt-4 text-slate-600">No lessons found yet.</p>
        )}
      </section>
    </main>
  );
}