"use client";

import { useState } from "react";

async function sha1(text: string) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function checkStrength(pw: string) {
  const tips: string[] = [];
  let points = 0;

  if (pw.length >= 8) points++;
  else tips.push("Use at least 8 characters.");
  if (pw.length >= 12) points++;
  else tips.push("12 or more characters is much safer.");
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) points++;
  else tips.push("Mix UPPERCASE and lowercase letters.");
  if (/[0-9]/.test(pw)) points++;
  else tips.push("Add a number.");
  if (/[^A-Za-z0-9]/.test(pw)) points++;
  else tips.push("Add a symbol like ! @ # -");

  const common = ["password", "123456", "qwerty", "iloveyou", "admin", "welcome"];
  if (common.some((c) => pw.toLowerCase().includes(c))) {
    points = Math.min(points, 1);
    tips.push("Avoid common words like 'password' or '123456'.");
  }

  const levels = [
    { label: "Very weak", color: "bg-red-600", width: "20%" },
    { label: "Weak", color: "bg-orange-500", width: "40%" },
    { label: "Fair", color: "bg-yellow-500", width: "60%" },
    { label: "Good", color: "bg-lime-500", width: "80%" },
    { label: "Strong", color: "bg-green-600", width: "100%" },
  ];
  const level = levels[Math.max(0, Math.min(points - 1, 4))];
  return { ...level, tips, empty: pw.length === 0 };
}

export default function PasswordCheckerPage() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [breach, setBreach] = useState<string>("");
  const [checking, setChecking] = useState(false);

  const strength = checkStrength(pw);

  async function checkBreach() {
    if (!pw) return;
    setChecking(true);
    setBreach("");
    try {
      const hash = await sha1(pw);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await res.text();
      const line = text.split("\n").find((l) => l.startsWith(suffix));
      if (line) {
        const count = parseInt(line.split(":")[1], 10);
        setBreach(
          `⚠️ This password appeared in data breaches ${count.toLocaleString()} times. Do not use it anywhere.`
        );
      } else {
        setBreach("✅ Not found in known breaches. Good sign!");
      }
    } catch {
      setBreach("Could not check right now. Please try again.");
    }
    setChecking(false);
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
        <h1 className="text-3xl font-bold">🔑 Password Checker</h1>
        <p className="mt-2 text-slate-600">
          Test a password. Tip: try a similar one, not your real password.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-sm font-medium text-slate-700">Type a password</label>
          <div className="mt-1 flex gap-2">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setBreach("");
              }}
              className="w-full rounded-lg border border-slate-300 p-2 text-slate-900"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="rounded-lg border border-slate-300 px-3 text-sm"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          {!strength.empty && (
            <div className="mt-4">
              <div className="h-3 w-full rounded-full bg-slate-200">
                <div
                  className={`h-3 rounded-full ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <div className="mt-2 font-semibold">{strength.label}</div>
              {strength.tips.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  {strength.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button
            onClick={checkBreach}
            disabled={!pw || checking}
            className="mt-6 w-full rounded-lg bg-blue-700 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {checking ? "Checking..." : "Check if it was leaked"}
          </button>

          {breach && (
            <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{breach}</p>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Your password is never sent or stored. Only the first 5 characters of its scrambled
          hash are used for the breach check.
        </p>
      </section>
    </main>
  );
}