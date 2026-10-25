"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

type Report = {
  id: number;
  ref_code: string;
  category: string;
  status: string;
  created_at: string;
};

const categories = [
  "Cyberbullying or harassment",
  "Online scam or fraud",
  "Account hacked",
  "Blackmail or threats",
  "Fake profile or impersonation",
  "Other",
];

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SS-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function ReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [doneCode, setDoneCode] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);

  async function loadReports() {
    const supabase = createClient();
    const { data } = await supabase
      .from("incident_reports")
      .select("id, ref_code, category, status, created_at")
      .order("created_at", { ascending: false });
    setReports(data || []);
  }

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      await loadReports();
      setReady(true);
    }
    load();
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const code = makeCode();

    const { error: insertError } = await supabase.from("incident_reports").insert({
      ref_code: code,
      user_id: anonymous ? null : userData.user?.id,
      category,
      description,
    });

    setSending(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      setDoneCode(code);
      setDescription("");
      await loadReports();
    }
  }

  if (!ready) {
    return <main className="p-10 text-slate-600">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="text-xl font-bold text-blue-700">🛡️ StudentShield</div>
        <a href="/dashboard" className="text-sm font-semibold text-blue-700 underline">
          ← Back to dashboard
        </a>
      </header>

      <section className="mx-auto max-w-xl px-6 py-10">
        <h1 className="text-3xl font-bold">🚨 Report an incident</h1>
        <p className="mt-2 text-slate-600">
          Tell us what happened. It is not your fault, and you are not in trouble.
        </p>

        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          If you lost money, call <strong>1930</strong> right away and report at{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            cybercrime.gov.in
          </a>
          . If you are in danger, call <strong>112</strong>.
        </div>

        {doneCode && (
          <div className="mt-6 rounded-xl bg-green-100 p-5 text-green-900">
            <div className="font-bold">✅ Report sent</div>
            <p className="mt-1 text-sm">Your reference code is:</p>
            <div className="mt-1 text-2xl font-bold tracking-wider">{doneCode}</div>
            <p className="mt-2 text-sm">Save this code. You will need it to ask about your report.</p>
          </div>
        )}

        <form
          onSubmit={submit}
          className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-slate-700">What happened?</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-slate-700">Describe it</label>
          <textarea
            required
            minLength={10}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened, when, and on which app or website?"
            className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
          />

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Send anonymously (staff will not see who I am)
          </label>

          <p className="mt-3 text-xs text-slate-500">
            Do not write passwords, OTPs or card numbers in this form.
          </p>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className="mt-5 w-full rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Submit report"}
          </button>
        </form>

        {reports.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold">My reports</h2>
            <p className="text-sm text-slate-500">Anonymous reports do not appear here.</p>
            <div className="mt-3 space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.ref_code}</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{r.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}