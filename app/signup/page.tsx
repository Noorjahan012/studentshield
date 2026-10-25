"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-blue-700">🛡️ Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">Join StudentShield for free.</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">Full name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password (at least 6 characters)
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
        />

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-700 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-blue-700 underline">
            Log in
          </a>
        </p>
      </form>
    </main>
  );
}