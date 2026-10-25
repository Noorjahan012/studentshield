const features = [
  {
    icon: "📚",
    title: "Safety Lessons",
    text: "Short lessons on phishing, UPI scams, fake job offers, passwords and privacy.",
  },
  {
    icon: "🎮",
    title: "Scam Spotter Game",
    text: "See real-looking emails, SMS and DMs. Decide: safe or scam?",
  },
  {
    icon: "🔑",
    title: "Password Checker",
    text: "Test how strong your password is without sending it anywhere.",
  },
  {
    icon: "🔗",
    title: "Link Checker",
    text: "Paste a suspicious link and find out if it is dangerous.",
  },
  {
    icon: "🚨",
    title: "Report an Incident",
    text: "Report bullying, scams or hacking safely, even anonymously.",
  },
  {
    icon: "🤖",
    title: "AI Safety Assistant",
    text: "Ask what to do when something goes wrong online and get clear steps.",
  },
];

const steps = [
  { n: "1", title: "Sign up", text: "Create your free student account." },
  { n: "2", title: "Learn", text: "Complete short lessons and quizzes." },
  { n: "3", title: "Earn", text: "Collect XP and badges as you improve." },
  { n: "4", title: "Stay safe", text: "Use the tools and get help when needed." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-blue-700">🛡️ StudentShield</div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-blue-700">Features</a>
            <a href="#how" className="hover:text-blue-700">How it works</a>
            <a href="#help" className="hover:text-blue-700">Get help</a>
          </nav>
          <a
            href="/login"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Log in
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Stay smart. Stay safe. Stay online.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            StudentShield teaches college students how to spot scams, protect
            their accounts and get help fast when something goes wrong online.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-800 hover:bg-blue-50"
            >
              Get started free
            </a>
            <a
              href="#features"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold">Everything you need to stay safe</h2>
        <p className="mt-2 text-center text-slate-600">
          Learn, practise and get help, all in one place.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-xl font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help */}
      <section id="help" className="mx-auto max-w-4xl px-6 py-20">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-800">Need help right now?</h2>
          <p className="mt-3 text-red-900">
            If you are a victim of online fraud or cybercrime in India, call{" "}
            <strong>1930</strong> or report at{" "}
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              cybercrime.gov.in
            </a>
            . If you are in danger, call <strong>112</strong>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        © 2026 StudentShield. Built to keep students safe online.
      </footer>
    </main>
  );
}