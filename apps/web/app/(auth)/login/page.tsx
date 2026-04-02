"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fullUrl = `${API_URL}/api/v1/auth/login`;
    console.log(`[Auth] Attempting login at: ${fullUrl}`);
    setLoading(true);

    try {
      const res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error(`[Auth] Expected JSON but received: ${contentType}`, text.slice(0, 200));
        throw new Error(`Server returned HTML instead of JSON. Please check your NEXT_PUBLIC_API_URL setting in Vercel.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("nexus_access_token", data.accessToken);
      localStorage.setItem("nexus_refresh_token", data.refreshToken);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-[400px] px-4">

        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 relative">
            <div className="absolute inset-0 rounded-2xl bg-violet-500/20 border border-violet-500/40 shadow-brand" />
            <div className="relative flex items-center justify-center">
              {/* Custom N logo mark */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 23V5L14 18V5L23 23" stroke="var(--violet-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="font-syne text-2xl font-bold text-text-primary tracking-tight">Nexus Corp</h1>
          <p className="text-text-tertiary mt-1 font-dmsans text-sm">Enterprise Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-bg-surface border border-border-default rounded-2xl p-7 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-tertiary"
              >
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nexus.co"
                required
                className={cn(
                  "h-10 bg-bg-sunken border-border-default text-text-primary placeholder:text-text-tertiary font-dmsans text-[13px] transition-all duration-fast",
                  "focus:border-brand-default focus:ring-2 focus:ring-brand-muted focus:ring-offset-0"
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-tertiary"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-[11px] font-medium text-brand-text hover:text-brand-hover transition-fast"
                  onClick={() => router.push("/reset-password")}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={cn(
                    "h-10 bg-bg-sunken border-border-default text-text-primary pr-10 font-dmsans text-[13px] transition-all duration-fast",
                    "focus:border-brand-default focus:ring-2 focus:ring-brand-muted focus:ring-offset-0"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-fast"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-[12px] px-4 py-3 rounded-lg font-dmsans font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              id="login-submit"
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-10 font-syne font-bold text-[13px] tracking-wider text-white transition-all duration-fast",
                "bg-brand-default hover:bg-brand-hover",
                "shadow-brand hover:shadow-lg",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "SIGN IN TO NEXUS"
              )}
            </Button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center px-1">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <span className="relative px-4 bg-bg-surface text-[10px] font-bold text-text-tertiary uppercase tracking-widest">OR</span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-border-default hover:bg-bg-elevated text-text-primary font-bold text-[11px] tracking-wider transition-all flex items-center justify-center gap-2"
              onClick={() => alert("Google SSO is protected by corporate policy. Please use work email for now.")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              SIGN IN WITH GOOGLE
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border-subtle">
            <p className="text-center text-[12px] font-medium text-text-tertiary">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-brand-text hover:text-brand-hover font-bold transition-fast"
              >
                Create one
              </button>
            </p>
          </div>

          </div>

          <p className="text-center mt-6 text-[10px] font-mono text-text-tertiary opacity-40 uppercase tracking-widest">
            Nexus Corp © 2026 · Internal Engineering Platform
          </p>
        </div>
      </div>
  );
}
