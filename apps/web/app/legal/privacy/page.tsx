"use client";

import { ShieldCheck, Eye, Lock, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  const points = [
    { title: "Telemetry Collection", icon: Eye, content: "We collect performance logs, request traces, and system usage metrics to optimize Vanguard Hub and ensure infrastructure stability." },
    { title: "Personal Data", icon: ShieldCheck, content: "Your @Vanguard.co email and basic profile info are used only for authentication and role-based access control (RBAC)." },
    { title: "Third-Party Sharing", icon: Lock, content: "We do not share your internal data with external parties except where required by corporate governance audits (SOX/SOC2)." },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-4 text-center pb-8 border-b border-border-subtle font-syne">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight">
          Privacy & <br /> Data Protection
        </h1>
        <p className="text-sm text-text-tertiary font-mono">ENFORCED BY Vanguard SECURITY COMPLIANCE · v2026.1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
        {points.map((point, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 bg-bg-panel/50 border border-border-default hover:border-brand-default transition-all duration-300">
            <div className="h-10 w-10 rounded-none bg-brand-default/10 text-brand-text flex items-center justify-center">
              <point.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-syne font-bold text-text-primary">{point.title}</h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed font-medium font-dmsans">{point.content}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8 py-8 font-dmsans">
        <h2 className="text-2xl font-syne font-bold text-text-primary uppercase tracking-tighter">Your Rights & Control</h2>
        <div className="space-y-4">
           {["Data Portability: Requesting an export of your activity logs via the Tickets module.", "Audit Transparency: Viewing which admin identities accessed your profile in the last 90 days.", "Deletion: Purging non-essential metadata upon request (subject to retention policies)."].map((txt, i) => (
             <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
               <div className="h-1.5 w-1.5 rounded-full bg-brand-default" />
               {txt}
             </div>
           ))}
        </div>
      </div>

      <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex items-center gap-2 text-emerald-500 font-bold">
           <CheckCircle2 className="h-4 w-4" />
           <span className="text-[10px] uppercase tracking-widest tracking-widest">SOC2 Type II Certified</span>
         </div>
         <p className="text-[11px] text-text-tertiary uppercase font-bold tracking-widest tracking-widest">Vanguard Corp Security Division</p>
      </div>
    </div>
  );
}
