"use client";

import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export default function TermsOfService() {
  const sections = [
    { title: "Acceptance of Terms", content: "By accessing or using the Vanguard Hub (Enterprise Management System), you agree to be bound by these terms. This platform is provided exclusively for internal engineering and management operations of Vanguard Corp." },
    { title: "Authorized Access", content: "Access is restricted to employees and contractors with a valid @Vanguard.co identity. Sharing credentials or bypassing multi-factor authentication (MFA) protocols is strictly prohibited." },
    { title: "Intellectual Property", content: "All software, designs, algorithms, and telemetry data generated within this platform remain the exclusive property of Vanguard Corp. Reverse engineering or unauthorized extraction of source code is a breach of contract." },
    { title: "Compliance & Governance", content: "Usage is subject to audit for security and performance purposes. Any discovery of critical vulnerabilities must be reported immediately via the Support Tickets system." },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-brand-text mb-2">
          <ShieldAlert className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-widest">Legal Document</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-syne font-bold text-text-primary tracking-tight leading-tight">
          Terms of <br /> Service Agreement
        </h1>
        <p className="text-sm text-text-tertiary font-mono">LAST UPDATED: APRIL 2, 2026 · VERSION 4.2.0-STABLE</p>
      </div>

      <div className="p-6 bg-brand-default/5 border border-brand-default/20 rounded-none border-l-4 border-l-brand-default">
         <div className="flex gap-4">
           <AlertTriangle className="h-5 w-5 text-brand-text shrink-0 mt-0.5" />
           <p className="text-sm text-text-secondary leading-relaxed italic">
             Important: Vanguard Hub is an Internal Enterprise Tool. All actions are logged and subject to the Vanguard Corp Global Code of Conduct.
           </p>
         </div>
      </div>

      <div className="space-y-16 py-8">
        {sections.map((section, i) => (
          <div key={i} className="group space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-brand-text opacity-50">0{i + 1}</span>
              <h2 className="text-xl font-syne font-bold text-text-primary group-hover:translate-x-2 transition-transform duration-300">
                {section.title}
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-8 border-l border-border-subtle group-hover:border-brand-default transition-colors duration-500">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex items-center gap-2 text-emerald-500">
           <CheckCircle2 className="h-4 w-4" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Governance Validated</span>
         </div>
         <p className="text-[11px] text-text-tertiary">For inquiries regarding these terms, contact <span className="text-brand-text font-bold cursor-pointer hover:underline">legal@Vanguard.co</span></p>
      </div>
    </div>
  );
}
