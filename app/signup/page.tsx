"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { registerAction } from "@/app/actions/auth";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await registerAction({ email, username, name, password });
    if (!res.success) {
      setError(res.error || "Registration failed");
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (signInRes?.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 800);
    } else {
      // Registration succeeded but auto-login failed — redirect to login
      router.push("/login?registered=1");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0705] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-7 w-7 text-[#c9a87a]" />
          <span className="text-xl font-bold font-serif text-[#f0dfc0]">Bookify</span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-[#2a1508]/60"
          style={{ background: "linear-gradient(145deg, #1a0d07 0%, #160a05 100%)" }}
        >
          <h1 className="text-2xl font-bold font-serif text-[#f0dfc0] mb-1">Create your account</h1>
          <p className="text-sm text-[#8a6040] mb-6">Start building your reading identity today.</p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg bg-green-950/40 border border-green-800/40 text-green-300 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Account created! Redirecting to your hearth…
            </div>
          )}

          {/* Google */}
          <button
            id="google-signup-btn"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a1508] bg-[#1e0d06] hover:bg-[#2a1508] text-[#e8d5c0] text-sm font-medium transition-all disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#2a1508]" />
            <span className="text-xs text-[#5a3a22]">or</span>
            <div className="h-px flex-1 bg-[#2a1508]" />
          </div>

          {/* Registration form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#c9a87a] mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0f0705] border border-[#2a1508] text-[#e8d5c0] placeholder:text-[#4a3020] focus:outline-none focus:border-[#c9a87a] text-sm transition-colors"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#c9a87a] mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="midnight_reader"
                  autoComplete="username"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0f0705] border border-[#2a1508] text-[#e8d5c0] placeholder:text-[#4a3020] focus:outline-none focus:border-[#c9a87a] text-sm transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#c9a87a] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full px-3 py-2.5 rounded-lg bg-[#0f0705] border border-[#2a1508] text-[#e8d5c0] placeholder:text-[#4a3020] focus:outline-none focus:border-[#c9a87a] text-sm transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#c9a87a] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="min. 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0f0705] border border-[#2a1508] text-[#e8d5c0] placeholder:text-[#4a3020] focus:outline-none focus:border-[#c9a87a] text-sm transition-colors"
              />
            </div>
            <button
              type="submit"
              id="signup-submit-btn"
              disabled={loading || googleLoading || success}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#c9a87a] text-[#0f0705] font-bold text-sm hover:bg-[#f0dfc0] disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-[#5a3a22] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#c9a87a] hover:text-[#f0dfc0] font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
