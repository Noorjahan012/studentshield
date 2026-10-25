"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

type Scenario = {
  id: number;
  channel: string;
  sender: string;
  message: string;
  is_scam: boolean;
  explanation: string;
};

export default function ScamSpotterPage() {
  const router = useRouter();
  const [items, setItems] = useState<Scenario[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase.from("scam_scenarios").select("*");
      const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);
      setItems(shuffled);
      setLoading(false);
    }

    load();
  }, [router]);

  function choose(saidScam: boolean) {
    if (answer !== null) return;
    setAnswer(saidScam);
    if (saidScam === items[index].is_scam) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (index + 1 >= items.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setAnswer(null);
    }
  }

  function restart() {
    setItems([...items].sort(() => Math.random() - 0.5));
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setFinished(false);
  }

  if (loading) {
    return <main className="p-10 text-slate-600">Loading...</main>;
  }

  const current = items[index];
  const correct = answer !== null && current && answer === current.is_scam;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="text-xl font-bold text-blue-700">🛡️ StudentShield</div>
        <a href="/dashboard" className="text-sm font-semibold text-blue-700 underline">
          ← Back to dashboard
        </a>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">🎮 Scam Spotter</h1>
        <p className="mt-2 text-slate-600">Read the message. Is it safe or a scam?</p>

        {items.length === 0 && (
          <p className="mt-6 text-slate-600">No scenarios found yet.</p>
        )}

        {finished ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
            <div className="text-5xl">{score >= items.length * 0.75 ? "🏆" : "💪"}</div>
            <h2 className="mt-3 text-2xl font-bold">
              You scored {score} / {items.length}
            </h2>
            <p className="mt-2 text-slate-600">
              {score >= items.length * 0.75
                ? "Excellent! You can spot most scams."
                : "Good try. Play again to get even sharper."}
            </p>
            <button
              onClick={restart}
              className="mt-6 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Play again
            </button>
          </div>
        ) : (
          current && (
            <div className="mt-8">
              <div className="mb-2 text-sm text-slate-500">
                Question {index + 1} of {items.length} · Score {score}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-semibold uppercase text-slate-500">
                  {current.channel}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-700">
                  From: {current.sender}
                </div>
                <p className="mt-4 rounded-lg bg-slate-100 p-4 text-slate-900">
                  {current.message}
                </p>
              </div>

              {answer === null ? (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => choose(false)}
                    className="rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    ✅ Safe
                  </button>
                  <button
                    onClick={() => choose(true)}
                    className="rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
                  >
                    🚨 Scam
                  </button>
                </div>
              ) : (
                <div
                  className={`mt-6 rounded-xl p-5 ${
                    correct ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
                  }`}
                >
                  <div className="font-bold">
                    {correct ? "✅ Correct!" : "❌ Not quite."}
                  </div>
                  <p className="mt-2">{current.explanation}</p>
                  <button
                    onClick={next}
                    className="mt-4 rounded-lg bg-slate-800 px-5 py-2 font-semibold text-white hover:bg-slate-900"
                  >
                    {index + 1 >= items.length ? "See my score" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </section>
    </main>
  );
}