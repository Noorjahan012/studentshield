export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <a href="/" className="text-xl font-bold text-blue-700">🛡️ StudentShield</a>
      </header>
      <section className="mx-auto max-w-2xl px-6 py-10 leading-7 text-slate-800">
        <h1 className="text-3xl font-bold">Privacy</h1>
        <p className="mt-4">We collect only what we need to run StudentShield.</p>

        <h2 className="mt-6 text-xl font-bold">What we store</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Your name and email, so you can log in.</li>
          <li>Which lessons you finished.</li>
          <li>Incident reports you submit.</li>
        </ul>

        <h2 className="mt-6 text-xl font-bold">Anonymous reports</h2>
        <p className="mt-2">If you tick "Send anonymously", your report is saved without your account attached.</p>

        <h2 className="mt-6 text-xl font-bold">Password and link checkers</h2>
        <p className="mt-2">The password you test is never saved. The breach check sends only part of a scrambled hash. Links you check stay in your browser.</p>

        <h2 className="mt-6 text-xl font-bold">Who can see reports</h2>
        <p className="mt-2">Only approved staff can read incident reports. We do not sell your data.</p>

        <p className="mt-6 text-sm text-slate-500">This is a student project. If used with minors, get parental or institutional consent as required by law.</p>
      </section>
    </main>
  );
}