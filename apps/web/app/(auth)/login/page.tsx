"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Google Identity Services
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      
      // Also show One Tap prompt automatically for seamless experience
      window.google.accounts.id.prompt();
    }
  }, [router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleGoogleResponse(response: any) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("vanguard_access_token", data.accessToken);
      localStorage.setItem("vanguard_refresh_token", data.refreshToken);
      localStorage.setItem("vanguard_user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function triggerGoogleLogin() {
    if (window.google) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback if prompt doesn't show
          window.google.accounts.id.renderButton(
            document.getElementById("google-hidden-btn"),
            { theme: "outline", size: "large" }
          );
          const hiddenBtn = document.querySelector("#google-hidden-btn [role=button]") as HTMLElement;
          if (hiddenBtn) hiddenBtn.click();
        }
      });
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fullUrl = `${API_URL}/api/v1/auth/login`;
    setLoading(true);

    try {
      const res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("vanguard_access_token", data.accessToken);
      localStorage.setItem("vanguard_refresh_token", data.refreshToken);
      localStorage.setItem("vanguard_user", JSON.stringify(data.user));

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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-none mb-5 relative">
            <div className="absolute inset-0 rounded-none bg-violet-500/20 border border-violet-500/40 shadow-brand" />
            <div className="relative flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 5L14 23L23 5" stroke="var(--violet-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="font-syne text-2xl font-bold text-text-primary tracking-tight uppercase">Vanguard Corp</h1>
          <p className="text-text-tertiary mt-1 font-dmsans text-[11px] font-bold uppercase tracking-widest">Strategic Execution Hub</p>
        </div>

        {/* Login Card */}
        <div className="bg-bg-surface border border-border-strong rounded-none p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle card glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-default/5 blur-3xl pointer-events-none" />
          
          <form onSubmit={handleLogin} className="relative space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary"
              >
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@vanguard.sh"
                required
                className={cn(
                  "h-10 bg-bg-sunken border-border-default rounded-none text-text-primary placeholder:text-text-tertiary font-dmsans text-[13px] transition-all",
                  "focus:border-brand-default focus:ring-0"
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-wider text-brand-text hover:text-brand-hover transition-all"
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
                    "h-10 bg-bg-sunken border-border-default rounded-none text-text-primary pr-10 font-dmsans text-[13px] transition-all",
                    "focus:border-brand-default focus:ring-0"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-all"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-[11px] px-4 py-3 rounded-none font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              id="login-submit"
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-10 font-syne font-bold text-[13px] tracking-wider text-white transition-all rounded-none",
                "bg-brand-default hover:bg-brand-hover",
                "shadow-brand active:scale-[0.98]",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  SIGNING IN...
                </span>
              ) : (
                "SIGN IN TO VANGUARD"
              )}
            </Button>

            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center px-1">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <span className="relative px-4 bg-bg-surface text-[10px] font-bold text-text-tertiary uppercase tracking-widest">OR</span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-border-default hover:bg-bg-elevated text-text-primary font-bold text-[11px] tracking-wider transition-all flex items-center justify-center gap-2 rounded-none"
              onClick={triggerGoogleLogin}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              SIGN IN WITH GOOGLE
            </Button>
            <div id="google-hidden-btn" className="hidden" />
          </form>

          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-center text-[12px] font-medium text-text-tertiary">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-brand-text hover:text-brand-hover font-bold transition-all"
              >
                Create one
              </button>
            </p>
          </div>

          </div>

          <p className="text-center mt-6 text-[10px] font-mono text-text-tertiary opacity-30 uppercase tracking-widest">
            Vanguard Corp © 2026 · Strategic Execution Platform
          </p>
        </div>
      </div>
  );
}
