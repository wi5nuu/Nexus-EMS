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
  const [email, setEmail] = useState("admin@nexus.co");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("nexus_access_token", data.accessToken);
      localStorage.setItem("nexus_refresh_token", data.refreshToken);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
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
          </form>

          {/* Demo credentials */}
          <div className="mt-5 pt-5 border-t border-border-subtle">
            <div className="flex items-center gap-2 justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <p className="text-[11px] font-mono text-text-tertiary text-center">
                Demo: <span className="text-brand-text font-bold">admin@nexus.co</span>{" "}
                /{" "}
                <span className="text-brand-text font-bold">password123</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-[10px] font-mono text-text-tertiary opacity-40 uppercase tracking-widest">
          Nexus Corp © 2026 · Internal Engineering Platform
        </p>
      </div>
    </div>
  );
}
