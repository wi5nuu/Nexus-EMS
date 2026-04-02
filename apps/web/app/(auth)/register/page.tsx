"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please check your details.");
      }

      // Automatically log in or redirect to login
      localStorage.setItem("nexus_access_token", data.accessToken);
      localStorage.setItem("nexus_refresh_token", data.refreshToken);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center relative overflow-hidden py-10">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-[450px] px-4">
        {/* Logo & Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 relative">
            <div className="absolute inset-0 rounded-2xl bg-violet-500/20 border border-violet-500/40 shadow-brand" />
            <div className="relative flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M5 23V5L14 18V5L23 23" stroke="var(--violet-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="font-syne text-xl font-bold text-text-primary tracking-tight">Create your Nexus Account</h1>
          <p className="text-text-tertiary mt-1 font-dmsans text-[13px]">Protected by NexGuard Policy 🛡️</p>
        </div>

        {/* Register Card */}
        <div className="bg-bg-surface border border-border-default rounded-2xl p-7 shadow-lg">
          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="h-9 bg-bg-sunken border-border-default text-[13px] focus:ring-brand-default"
                />
              </div>
              {/* Last Name */}
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="h-9 bg-bg-sunken border-border-default text-[13px] focus:ring-brand-default"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Work Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@nexus.co"
                required
                className="h-9 bg-bg-sunken border-border-default text-[13px] focus:ring-brand-default"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="h-9 bg-bg-sunken border-border-default pr-10 text-[13px] focus:ring-brand-default"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Complexity hint */}
              {password.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className={cn("h-1 flex-1 rounded-full", password.length >= 8 ? "bg-emerald-500" : "bg-bg-elevated")} />
                  <div className={cn("h-1 flex-1 rounded-full", /[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? "bg-emerald-500" : "bg-bg-elevated")} />
                  <span className="text-[10px] text-text-tertiary font-medium">Strength</span>
                </div>
              )}
            </div>

            {/* TOS Checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <div 
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all",
                  agreed ? "bg-brand-default border-brand-default" : "bg-bg-sunken border-border-default"
                )}
                onClick={() => setAgreed(!agreed)}
              >
                {agreed && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <p className="text-[11px] text-text-tertiary leading-tight">
                I agree to the <span className="text-brand-text font-bold cursor-pointer transition-fast hover:text-brand-hover">Terms of Service</span> and <span className="text-brand-text font-bold cursor-pointer transition-fast hover:text-brand-hover">Privacy Policy</span>. I understand this system is protected by corporate security policies.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-[12px] px-3 py-2 rounded-lg font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-9 font-syne font-bold text-[13px] tracking-wider text-white transition-all",
                "bg-brand-default hover:bg-brand-hover",
                "shadow-brand hover:shadow-lg",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "CREATE ACCOUNT"}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border-subtle">
            <p className="text-center text-[12px] font-medium text-text-tertiary">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-brand-text hover:text-brand-hover font-bold transition-fast"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-[10px] font-mono text-text-tertiary opacity-40 uppercase tracking-widest">
          Nexus Corp © 2026 · Enterprise Security First
        </p>
      </div>
    </div>
  );
}
