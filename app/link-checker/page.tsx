"use client";

import { useState } from "react";

type Result = { level: "danger" | "warning" | "ok"; reasons: string[]; host: string };

const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "cutt.ly", "rb.gy", "is.gd", "shorturl.at"];
const badTlds = [".xyz", ".top", ".click", ".info", ".online", ".site", ".live", ".buzz", ".icu", ".tk", ".ml", ".gq"];
const keywords = ["login", "verify", "update", "kyc", "secure", "account", "bonus", "prize", "reward", "wallet", "refund"];
const brands = ["sbi", "hdfc", "icici", "paytm", "phonepe", "amazon", "flipkart", "google", "instagram", "whatsapp", "netflix"];

function analyze(input: string): Result | null {
  let text = input.trim();
  if (!text) return null;
  if (!/^https?:\/\//i.test(text)) text = "http://" + text;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return { level: "warning", reasons: ["This does not look like a valid web address."], host: "" };
  }

  const host = url.hostname.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  if (url.protocol === "http:" && /^http:\/\//i.test(input.trim())) {
    reasons.push("It uses http, not https, so the connection is not encrypted.");
    score += 1;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    reasons.push("The address is a raw IP number instead of a normal website name.");
    score += 3;
  }
  if (shorteners.includes(host)) {
    reasons.push("It is a shortened link, so you cannot see where it really goes.");
    score += 2;
  }
  if (badTlds.some((t) => host.endsWith(t))) {
    reasons.push("It ends with a domain type often used by scam sites.");
    score += 2;
  }
  if (input.includes("@")) {
    reasons.push("It contains an @ symbol, which can hide the real destination.");
    score += 3;
  }
  if (host.startsWith("xn--") || host.includes(".xn--")) {
    reasons.push("It uses special look-alike characters (punycode) to imitate a real site.");
    score += 3;
  }
  if (host.split(".").length > 4) {
    reasons.push("It has many sub-domains, a common trick to look official.");
    score += 1;
  }
  if ((host.match(/-/g) || []).length >= 2) {
    reasons.push("The domain has several hyphens, which is common in fake sites.");
    score += 1;
  }

  const found = keywords.filter((k) => host.includes(k) || url.pathname.toLowerCase().includes(k));
  if (found.length > 0) {
    reasons.push(`It contains pressure words like: ${found.join(", ")}.`);
    score += 1;
  }

  const rootParts = host.split(".");
  const root = rootParts.slice(-2).join(".");
  const brandHit = brands.find((b) => host.includes(b) && !root.startsWith(b + "."));
  if (brandHit) {
    reasons.push(`It mentions "${brandHit}" but the real domain is "${root}". It may be imitating a brand.`);
    score += 3;
  }
  if (/[0-9]/.test(host.split(".")[0]) && /[a-z]/.test(host.split(".")[0]) && brands.some((b) => host.replace(/0/g, "o").replace(/1/g, "l").includes(b))) {
    reasons.push("Letters are swapped with numbers (like 0 for o) to imitate a real name.");
    score += 3;
  }
  if (input.length > 100) {
    reasons.push("The link is unusually long.");
    score += 1;
  }

  if (reasons.length === 0) {
    return { level: "ok", reasons: ["No common warning signs found."], host };
  }
  return { level: score >= 4 ? "danger" : "warning", reasons, host };
}

export default function LinkCheckerPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const styles = {
    danger: { box: "bg-red-100 text-red-900", title: "🚨 Looks dangerous. Do not open it." },
    warning: { box: "bg-yellow-100 text-yellow-900", title: "⚠️ Suspicious. Be careful." },
    ok: { box: "bg-green-100 text-green-900", title: "✅ No obvious warning signs." },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="text-xl font-bold text-blue-700">🛡️ StudentShield</div>
        <a href="/dashboard" className="text-sm font-semibold text-blue-700 underline">
          ← Back to dashboard
        </a>
      </header>

      <section className="mx-auto max-w-xl px-6 py-10">
        <h1 className="text-3xl font-bold">🔗 Link Checker</h1>
        <p className="mt-2 text-slate-600">Paste a link you are unsure about. Do not click it first.</p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setResult(null);
            }}
            placeholder="http://sbi-kyc-update.xyz/login"
            className="w-full rounded-lg border border-slate-300 p-2 text-slate-900"
          />
          <button
            onClick={() => setResult(analyze(input))}
            disabled={!input.trim()}
            className="mt-4 w-full rounded-lg bg-blue-700 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            Check link
          </button>

          {result && (
            <div className={`mt-6 rounded-xl p-5 ${styles[result.level].box}`}>
              <div className="font-bold">{styles[result.level].title}</div>
              {result.host && <div className="mt-1 text-sm">Website: {result.host}</div>}
              <ul className="mt-3 list-disc pl-5 text-sm">
                {result.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          This tool checks for common tricks only. A link with no warnings is not guaranteed
          safe. When in doubt, open the official app or website yourself instead.
        </p>
      </section>
    </main>
  );
}