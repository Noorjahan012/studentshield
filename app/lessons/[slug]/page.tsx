"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase";

type Lesson = {
  id: number;
  title: string;
  icon: string;
  content: string;
  xp: number;
};

function LessonContent() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: lessonData } = await supabase
        .from("lessons")
        .select("id, title, icon, content, xp")
        .eq("slug", slug)
        .maybeSingle();

      setLesson(lessonData);

      if (lessonData) {
        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("lesson_id", lessonData.id)
          .maybeSingle();
        setDone(!!progress);
      }
      setLoading(false);
    }

    load();
  }, [slug, router]);

  async function markDone() {
    if (!lesson) return;
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase
      .from("lesson_progress")
      .insert({ lesson_id: lesson.id });
    setSaving(false);

    if (error) {
      setMessage(error.message);
    } else {
      setDone(true);
    }
  }

  if (loading) {
    return <main className="p-10 text-slate-600">Loading...</main>;
  }

  if (!lesson) {
    return (
      <main className="p-10">
        <p className="text-slate-700">Lesson not found.</p>
        <a href="/dashboard" className="mt-4 inline-block font-semibold text-blue-700 underline">
          Back to dashboard
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="text-xl font-bold text-blue-700">🛡️ StudentShield</div>
        <a href="/dashboard" className="text-sm font-semibold text-blue-700 underline">
          ← Back to dashboard
        </a>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-5xl">{lesson.icon}</div>
        <h1 className="mt-3 text-3xl font-bold">{lesson.title}</h1>

        <div className="mt-6 whitespace-pre-line rounded-xl border border-slate-200 bg-white p-6 leading-7 text-slate-800">
          {lesson.content}
        </div>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        {done ? (
          <div className="mt-6 rounded-lg bg-green-100 p-4 font-semibold text-green-800">
            ✅ Lesson completed. You earned {lesson.xp} XP!
          </div>
        ) : (
          <button
            onClick={markDone}
            disabled={saving}
            className="mt-6 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : `Mark as done (+${lesson.xp} XP)`}
          </button>
        )}
      </article>
    </main>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<main className="p-10 text-slate-600">Loading...</main>}>
      <LessonContent />
    </Suspense>
  );
}