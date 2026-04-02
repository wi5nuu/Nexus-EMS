"use client";

import { PieChart, Settings, Shield, CheckCircle2 } from "lucide-react";

export default function CookieNotice() {
  const sections = [
    { title: "Essential Cookies", desc: "Used for session authentication (JWT), cross-site request forgery (CSRF) protection, and maintaining your workspace preferences. These cannot be disabled." },
    { title: "Performance Cookies", desc: "Used to collect anonymous telemetry data about system latency and error rates across the global Vanguard infrastructure." },
    { title: "Functional Cookies", desc: "Used to remember your UI customizations such as sidebar density, language choice, and notification silence periods." },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 font-dmsans">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-brand-text mb-2">
          <Settings className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">Cookie Policy</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-syne font-bold text-text-primary tracking-tight leading-tight">
          How Vanguard Uses <br /> Tracking Technologies
        </h1>
        <p className="text-sm text-text-tertiary">Vanguard Hub uses only essential and performance cookies to provide a secure, fast workspace. We never use third-party advertising trackers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
        {sections.map((sec, i) => (
          <div key={i} className="p-6 rounded-none bg-bg-panel border border-border-subtle hover:border-brand-default transition-all group">
            <div className="h-2 w-full bg-border-subtle mb-4 relative overflow-hidden">
               <div className="absolute inset-0 bg-brand-default group-hover:translate-x-0 -translate-x-full transition-transform duration-700" />
            </div>
            <h3 className="text-lg font-syne font-bold text-text-primary mb-2 uppercase tracking-tighter">{sec.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{sec.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-8 border border-border-default bg-bg-sunken/50 space-y-6">
         <h2 className="text-xl font-syne font-bold text-text-primary">Cookie Settings</h2>
         <p className="text-sm text-text-tertiary">Since Vanguard Hub is an internal corporate tool, all technical cookies are mandatory to comply with Vanguard Corp security policies (N-SEC-P104). To clear your preferences, please reset your browser's local storage for this domain.</p>
         <div className="flex items-center gap-4">
           <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
             <CheckCircle2 className="h-3 w-3" /> Technical Cookies Active
           </div>
           <div className="px-3 py-1 bg-crimson-500/10 border border-crimson-500/20 text-crimson-500 text-[10px] font-bold uppercase tracking-widest">Ad Trackers Disabled</div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
         <div className="flex items-center gap-4">
            <PieChart className="h-5 w-5 text-text-tertiary" />
            <Shield className="h-5 w-5 text-text-tertiary" />
         </div>
         <p className="text-[11px] font-mono uppercase tracking-widest text-text-tertiary tracking-widest">Secure Compute Division @ Vanguard</p>
      </div>
    </div>
  );
}
