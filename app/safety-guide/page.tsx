"use client";

import { useState } from "react";

const guides = [
  {
    id: "blackmail",
    icon: "😰",
    title: "Someone is blackmailing me",
    steps: [
      "Do not pay and do not send more photos or videos. Paying usually leads to more demands.",
      "Do not delete the chats. Take screenshots of messages, profile and any payment details.",
      "Block the person and report their profile on the app.",
      "Make your accounts private and change your passwords.",
      "Tell a trusted friend, family member or teacher. It is not your fault.",
      "Report at cybercrime.gov.in or call 1930.",
    ],
  },
  {
    id: "upi",
    icon: "💸",
    title: "I lost money in a UPI or online fraud",
    steps: [
      "Call 1930 immediately. Fast reporting can help freeze the money.",
      "Call your bank and ask them to block the card or account activity.",
      "Report at cybercrime.gov.in with screenshots and transaction IDs.",
      "Do not call fake 'refund' numbers that appear online.",
      "Change your UPI PIN and banking passwords.",
    ],
  },
  {
    id: "hacked",
    icon: "🔓",
    title: "My account was hacked",
    steps: [
      "Try to reset your password using the official 'Forgot password' option.",
      "Change the password of your email account first, then other accounts.",
      "Turn on two-factor authentication (2FA).",
      "Log out of all other devices in the account settings.",
      "Tell your contacts not to click links sent from your account.",
      "Report the hacked account to the app's support.",
    ],
  },
  {
    id: "job",
    icon: "💼",
    title: "I got a suspicious job or internship offer",
    steps: [
      "Do not pay any fee. Real employers never charge for a job.",
      "Check the company's official website and compare the email domain.",
      "Search the company name with 'scam' or 'reviews'.",
      "Never share Aadhaar, PAN or bank details before verifying.",
      "Ask your college placement cell. Report the number to cybercrime.gov.in.",
    ],
  },
  {
    id: "bullying",
    icon: "💬",
    title: "I am being bullied or harassed online",
    steps: [
      "Do not reply or fight back. Save screenshots with dates.",
      "Block the person and report the posts to the platform.",
      "Make your accounts private.",
      "Talk to someone you trust, like a friend, family member or counsellor.",
      "Use the Report page on StudentShield, or cybercrime.gov.in.",
      "If you feel very low, call Tele-MANAS at 14416 (free, 24x7).",
    ],
  },
  {
    id: "otp",
    icon: "📩",
    title: "I shared my OTP or clicked a bad link",
    steps: [
      "Change the password of the affected account right away.",
      "Call your bank if money or card details were involved.",
      "Log out of all devices and turn on 2FA.",
      "Run a security scan on your phone and uninstall unknown apps.",
      "If money was lost, call 1930.",
    ],
  },
];

export default function SafetyGuidePage() {
  const [open, setOpen] = useState<string | null>(null);
  const current = guides.find((g) => g.id === open);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="text-xl font-bold text-blue-700">🛡️ StudentShield</div>
        <a href="/dashboard" className="text-sm font-semibold text-blue-700 underline">
          ← Back to dashboard
        </a>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">🧭 Safety Guide</h1>
        <p className="mt-2 text-slate-600">Pick what happened. Get clear steps. It is not your fault.</p>

        {!current ? (
          <div className="mt-6 space-y-3">
            {guides.map((g) => (
              <button
                key={g.id}
                onClick={() => setOpen(g.id)}
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-400"
              >
                <span className="text-3xl">{g.icon}</span>
                <span className="font-semibold">{g.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <button onClick={() => setOpen(null)} className="text-sm font-semibold text-blue-700 underline">
              ← All situations
            </button>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-4xl">{current.icon}</div>
              <h2 className="mt-2 text-2xl font-bold">{current.title}</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-800">
                {current.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              Lost money? Call <strong>1930</strong>. In danger? Call <strong>112</strong>.{" "}
              <a href="/report" className="font-semibold underline">Report on StudentShield</a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}