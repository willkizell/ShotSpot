"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle, signInWithApple } from "@/lib/auth/actions";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signInWithEmail(email, password);
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

          <h1 className="text-xl font-semibold mb-6">Sign in</h1>

          {error && (
            <div className="border border-black bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
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
                className="w-full border-2 border-black bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-[#D7D7D7] py-2.5 text-sm font-semibold tracking-wide hover:bg-[#007B6F] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-[#D7D7D7] px-2 text-black/50">or continue with</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <form action={signInWithGoogle.bind(null, "athlete")}>
              <button
                type="submit"
                className="w-full border-2 border-black py-2.5 text-sm font-medium hover:bg-black hover:text-[#D7D7D7] transition-colors"
              >
                Continue with Google
              </button>
            </form>
            <form action={signInWithApple.bind(null, "athlete")}>
              <button
                type="submit"
                className="w-full border-2 border-black bg-black text-[#D7D7D7] py-2.5 text-sm font-medium hover:bg-[#007B6F] transition-colors"
              >
                Continue with Apple
              </button>
            </form>
          </div>

          <div className="border-t border-black/20 pt-6 space-y-2 text-sm text-center">
            <p>
              New athlete?{" "}
              <Link href="/athlete-signup" className="font-semibold underline underline-offset-2">
                Create free account
              </Link>
            </p>
            <p>
              Are you a coach?{" "}
              <Link href="/coach-signup" className="font-semibold underline underline-offset-2">
                Join as a coach
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
