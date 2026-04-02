"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";

import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    // Simulate reset request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Recovery instructions sent to your email.");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-[400px] px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <button 
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-all mb-8 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Login
        </button>

        <div className="bg-bg-surface border border-border-strong rounded-none p-8 shadow-2xl relative">
          {!submitted ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="font-syne text-2xl font-bold text-text-primary tracking-tight">RESET ACCESS</h1>
                <p className="text-text-secondary font-dmsans text-sm leading-relaxed">
                  Enter your work email address and we&apos;ll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                    Work Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@Vanguard.co"
                      required
                      className="h-11 bg-bg-sunken border-border-default rounded-none pl-10 text-text-primary placeholder:text-text-tertiary font-dmsans text-[13px] focus:border-brand-default"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-brand-default hover:bg-brand-hover text-white font-syne font-bold text-[13px] tracking-wider rounded-none shadow-brand"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      REQUESTING...
                    </span>
                  ) : (
                    "SEND RESET LINK"
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="font-syne text-xl font-bold text-text-primary">CHECK YOUR EMAIL</h2>
                <p className="text-text-secondary font-dmsans text-sm">
                  We&apos;ve sent a recovery link to <span className="text-text-primary font-bold">{email}</span>. 
                  Please check your inbox and spam folder.
                </p>
              </div>
              <Button 
                variant="outline"
                className="w-full border-border-default hover:bg-bg-elevated h-11 rounded-none text-xs font-bold"
                onClick={() => setSubmitted(false)}
              >
                Resend Email
              </Button>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-[10px] font-mono text-text-tertiary opacity-30 uppercase tracking-widest">
          Vanguard Corp Security Protocol §14.2
        </p>
      </div>
    </div>
  );
}
