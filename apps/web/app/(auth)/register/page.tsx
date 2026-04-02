"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Rocket, Globe, ShieldCheck, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-bg-page flex flex-col relative overflow-hidden font-dmsans">
      
      {/* ─── TOPBAR (AWS style) ─── */}
      <header className="h-14 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="h-8 w-8 rounded-lg bg-brand-default flex items-center justify-center shadow-brand">
            <span className="text-sm font-syne font-bold text-white">N</span>
          </div>
          <span className="font-syne font-bold text-lg tracking-tight text-text-primary">Nexus EMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-xs font-bold text-text-tertiary hover:text-text-primary gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            English
          </Button>
        </div>
      </header>

      {/* ─── BACKGROUND DECORATION ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Isometric Cube Pattern */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[60%] opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 15v30L30 60 0 45V15z' fill='none' stroke='%236366f1' stroke-width='1'/%3E%3Cpath d='M30 0v30M0 15l30 15 30-15' fill='none' stroke='%236366f1' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 104px",
            maskImage: "linear-gradient(to top, black, transparent)",
          }}
        />
        <div className="absolute top-20 right-[-100px] w-[600px] h-[600px] bg-brand-default/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full" />
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 z-10 gap-16 md:gap-24 max-w-7xl mx-auto w-full">
        
        {/* LEFT PANE: Marketing/Benefits */}
        <div className="hidden md:flex flex-col max-w-md space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="space-y-4">
            <h2 className="text-4xl font-syne font-bold text-text-primary leading-[1.1] tracking-tight">
              Scale your engineering <br /> 
              <span className="text-brand-text">at no cost</span> for 6 months
            </h2>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              Start with <span className="font-bold text-text-primary">Free Tier Credits</span>, plus unlock enterprise-grade CI/CD and RBAC by completing various onboarding activities.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-0 w-24 h-24 bg-brand-default/20 blur-[40px] rounded-full animate-pulse" />
            <div className="relative group transition-all duration-500">
               <div className="absolute inset-0 bg-brand-default/20 blur-2xl group-hover:blur-3xl transition-all rounded-full opacity-0 group-hover:opacity-100" />
               <Rocket className="h-48 w-48 text-brand-text drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] animate-float" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-bg-sunken border border-border-subtle flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">NexGuard™ Security</h4>
              <p className="text-[11px] text-text-tertiary">Zero-trust architecture for enterprise deployments.</p>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-bg-sunken border border-border-subtle flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">HyperScale CI/CD</h4>
              <p className="text-[11px] text-text-tertiary">The fastest build times for your monorepo.</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: The Form */}
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="bg-bg-surface border border-border-strong rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle card glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-default/5 blur-3xl pointer-events-none" />
            
            <div className="mb-8">
              <h3 className="text-2xl font-syne font-bold text-text-primary tracking-tight">Sign up for Nexus</h3>
              <p className="text-text-tertiary text-xs mt-1">Join the internal engineering platform of the future.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">First Name</Label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="First name" 
                    className="h-10 bg-bg-sunken border-border-default focus:border-brand-default transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Last Name</Label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Last name" 
                    className="h-10 bg-bg-sunken border-border-default focus:border-brand-default transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Root user email address</Label>
                <div className="relative group">
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@company.com" 
                    className="h-10 bg-bg-sunken border-border-default focus:border-brand-default transition-all"
                    required
                  />
                  <p className="text-[9px] text-text-tertiary mt-1.5 leading-relaxed">
                    Used for account recovery and as described in the <span className="text-brand-text font-bold cursor-pointer hover:underline">Nexus Privacy Notice</span>.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pb-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Master Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter your password" 
                    className="h-10 bg-bg-sunken border-border-default pr-10 focus:border-brand-default transition-all"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-fast"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* TOS Consent (AWS style check styling but premium) */}
              <div className="flex gap-3 pt-2">
                <div 
                  className={cn(
                    "h-4 w-4 rounded border mt-0.5 flex items-center justify-center cursor-pointer transition-all shrink-0",
                    agreed ? "bg-brand-default border-brand-default" : "bg-bg-sunken border-border-default hover:border-brand-default"
                  )}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                <p className="text-[11px] text-text-tertiary leading-snug">
                  I agree to the <span className="font-bold text-brand-text hover:underline cursor-pointer">Terms of Service</span> and acknowledge this system is protected by corporate governance policies.
                </p>
              </div>

              {/* Error State */}
              {error && (
                <div className="flex items-center gap-2 bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-[11px] p-3 rounded-xl font-medium animate-in zoom-in-95 duration-200">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 bg-brand-default hover:bg-brand-hover text-white font-syne font-bold text-[13px] tracking-wider transition-all duration-300 shadow-brand active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "VERIFY EMAIL & PROCEED"}
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
                  onClick={() => router.push("/login")}
                  className="w-full h-11 border-border-default hover:bg-bg-elevated text-text-primary font-bold text-[11px] tracking-wider transition-all"
                >
                  SIGN IN TO AN EXISTING ACCOUNT
                </Button>
              </div>
            </form>
          </div>

          <p className="text-center mt-8 text-[10px] font-mono text-text-tertiary opacity-30 uppercase tracking-widest leading-loose">
            This site uses essential cookies. See our <span className="underline cursor-pointer hover:text-text-secondary">Cookie Notice</span> for more information.
          </p>
        </div>
      </main>

      {/* Floating Rocket CSS Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
