"use client";

import { useState } from "react";
import Link from "next/link";
import { signUpAsAthlete, signInWithGoogle } from "@/lib/auth/actions";

export default function AthleteSignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signUpAsAthlete(email, password, fullName);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#D7D7D7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-black bg-[#D7D7D7] p-8">
          <Link href="/" className="block mb-8">
            <span
              className="text-3xl tracking-tight"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              SHOTSPOT
            </span>
          </Link>

          <h1 className="text-xl font-semibold mb-1">Create athlete account</h1>
          <p className="text-sm text-black/60 mb-6">Free forever. Pay only when you hire a coach.</p>

          {error && (
            <div className="border border-black bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border-2 border-black bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F]"
                placeholder="Ryan Crouser"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-black bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border-2 border-black bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F]"
                placeholder="8+ characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007B6F] text-white py-2.5 text-sm font-semibold tracking-wide hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create athlete account"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-[#D7D7D7] px-2 text-black/50">or</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <form action={signInWithGoogle.bind(null, "athlete")}>
              <button
                type="submit"
                className="w-full border-2 border-black py-2.5 text-sm font-medium hover:bg-black hover:text-[#D7D7D7] transition-colors"
              >
                Sign up with Google
              </button>
            </form>
          </div>

          <div className="border-t border-black/20 pt-6 text-sm text-center">
            <p>
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
