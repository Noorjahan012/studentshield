import Link from "next/link";

const contacts = [
  { name: "National Cyber Crime Helpline", detail: "Call 1930 if you lost money in online fraud. Call quickly, as early reporting helps freeze the money." },
  { name: "Cyber Crime Portal", detail: "Report online crimes at cybercrime.gov.in", link: "https://cybercrime.gov.in" },
  { name: "Emergency", detail: "If you or someone else is in danger, call 112." },
  { name: "Women and Child Helpline", detail: "Call 1091 (women) or 1098 (children)." },
  { name: "Mental health support", detail: "If you feel very low or unsafe, talk to someone you trust. In India you can call Tele-MANAS at 14416 (free, 24x7)." },
];

const steps = [
  "Stay calm. It is not your fault.",
  "Do not delete the messages. Take screenshots as evidence.",
  "Block the person and secure your accounts (change passwords, turn on 2FA).",
  "If money was lost, call 1930 immediately.",
  "Tell a trusted friend, family member or teacher.",
  "Report on StudentShield or at cybercrime.gov.in.",
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-700">🛡️ StudentShield</Link>
        <Link href="/dashboard" className="text-sm font-semibold text-blue-700 underline">Dashboard</Link>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">🆘 Get help</h1>
        <p className="mt-2 text-slate-600">You are not alone. Help is available.</p>

        <h2 className="mt-8 text-xl font-bold">If something went wrong online</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-800">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <h2 className="mt-8 text-xl font-bold">Helplines (India)</h2>
        <div className="mt-3 space-y-3">
          {contacts.map((c) => (
            <div key={c.name} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="font-semibold">{c.name}</div>
              <p className="mt-1 text-sm text-slate-700">
                {c.detail}
                {c.link && (
                  <>
                    {" "}
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline">
                      Open
                    </a>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Please verify helpline numbers on official government websites, as they can change.
        </p>
      </section>
    </main>
  );
}