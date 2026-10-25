"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

type Report = {
  id: number;
  ref_code: string;
  user_id: string | null;
  category: string;
  description: string;
  status: string;
  created_at: string;
};

const statuses = ["New", "In review", "Resolved"];

export default function AdminPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("All");
  const [state, setState] = useState<"loading" | "denied" | "ok">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .maybeSingle();

      if (!adminRow) {
        setState("denied");
        return;
      }

      const { data } = await supabase
        .from("incident_reports")
        .select("*")
        .order("created_at", { ascending: false });

      setReports(data || []);
      setState("ok");
    }

    load();
  }, [router]);

  async function changeStatus(id: number, status: string) {
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("incident_reports")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setReports((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  if (state === "loading") {
    return <main className="p-10 text-slate-600">Loading...</main>;
  }

  if (state === "denied") {
    return (
      <main className="p-10">
        <p className="text-slate-700">You do not have access to this page.</p>
        <a href="/dashboard" className="mt-4 inline-block font-semibold text-blue-700 underline">
          Back to dashboard
        </a>
      </main>
    );
  }

  const shown = filter === "All" ? reports : reports.filter((r) => r.status === filter);
  const count = (s: string) => reports.filter((r) => r.status === s).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="text-xl font-bold text-blue-700">🛡️ StudentShield Admin</div>
        <a href="/dashboard" className="text-sm font-semibold text-blue-700 underline">
          ← Back to dashboard
        </a>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold">Incident reports</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-500">Total</div>
            <div className="text-2xl font-bold text-blue-700">{reports.length}</div>
          </div>
          {statuses.map((s) => (
            <div key={s} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-500">{s}</div>
              <div className="text-2xl font-bold text-blue-700">{count(s)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...statuses].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1 text-sm font-semibold ${
                filter === s
                  ? "bg-blue-700 text-white"
                  : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 space-y-4">
          {shown.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold">{r.ref_code}</span>
                  <span className="ml-3 text-sm text-slate-500">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => changeStatus(r.id, e.target.value)}
                  className="rounded-lg border border-slate-300 p-1 text-sm text-slate-900"
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-700">{r.category}</div>
              <div className="text-xs text-slate-500">
                {r.user_id ? "Sent by a logged-in student" : "Anonymous"}
              </div>
              <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-100 p-3 text-sm text-slate-900">
                {r.description}
              </p>
            </div>
          ))}
          {shown.length === 0 && <p className="text-slate-600">No reports here.</p>}
        </div>
      </section>
    </main>
  );
}