"use client";

import { 
  BookOpen, Code, Terminal, 
  HelpCircle, Search, ChevronRight,
  ExternalLink, FileText, Globe,
  ShieldAlert, GitPullRequest, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DocsPortalPage() {
  const sections = [
    { 
      title: "Getting Started", 
      icon: BookOpen, 
      color: "text-violet-500", 
      bg: "bg-violet-500/10",
      items: ["Platform Overview", "Authentication Flow", "Role-Based Access Control", "Environment Setup"] 
    },
    { 
      title: "API Reference", 
      icon: Code, 
      color: "text-teal-500", 
      bg: "bg-teal-500/10",
      items: ["Projects API", "Tickets & Incidents", "HR Endpoints", "Rate Limiting Policy"] 
    },
    { 
      title: "Internal Infrastructure", 
      icon: Database, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10",
      items: ["Kubernetes Cluster", "Kafka Topics", "Redis Caching", "Storage Buckets (Minio)"] 
    },
    { 
      title: "Engineering Policy", 
      icon: ShieldAlert, 
      color: "text-crimson-500", 
      bg: "bg-crimson-500/10",
      items: ["Git Standards", "PR Review Process", "Security Compliance", "On-Call Rotation"] 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="space-y-2">
           <h1 className="font-syne font-black text-4xl sm:text-5xl text-text-primary tracking-tighter uppercase italic">Engineering Docs</h1>
           <p className="text-text-secondary font-dmsans max-w-xl text-lg">Central documentation portal for Nexus Corp platform engineers.</p>
        </div>
        <div className="relative w-full max-w-2xl">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
           <Input 
             placeholder="Search documentation, APIs, and policies..." 
             className="h-14 pl-12 bg-bg-surface border-border-default text-lg rounded-2xl shadow-lg focus:ring-2 focus:ring-brand-default transition-all"
           />
           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1.5 py-1 rounded border border-border-default bg-bg-panel text-[10px] font-mono text-text-tertiary">
              <span className="font-bold">⌘</span> K
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="bg-bg-surface border-border-default shadow-sm hover:border-brand-default/40 transition-all group">
            <CardHeader className="pb-4 border-b border-border-subtle bg-bg-panel/30">
               <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center transition-fast group-hover:scale-110", section.bg)}>
                     <section.icon className={cn("h-6 w-6", section.color)} />
                  </div>
                  <CardTitle className="text-lg font-syne font-bold text-text-primary uppercase tracking-tight">{section.title}</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="space-y-1">
                  {section.items.map((item) => (
                    <button key={item} className="w-full flex items-center justify-between p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50 transition-fast text-[13px] font-medium group/item">
                       <span className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-text-tertiary opacity-0 group-hover/item:opacity-100 transition-fast" />
                          {item}
                       </span>
                       <ChevronRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-fast -translate-x-2 group-hover/item:translate-x-0" />
                    </button>
                  ))}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
         {[
           { label: "Deployment Workflow", icon: GitPullRequest, desc: "Standard operating procedures for CICD." },
           { label: "Architecture RFCs", icon: Globe, desc: "Internal proposals and technical designs." },
           { label: "Developer Sandbox", icon: Terminal, desc: "Testing environment and staging guides." },
         ].map((link, i) => (
           <div key={i} className="bg-bg-panel/50 border border-border-subtle rounded-xl p-5 hover:bg-bg-surface transition-fast cursor-pointer group shadow-sm">
              <div className="h-10 w-10 rounded-full border border-border-default flex items-center justify-center mb-4 transition-fast group-hover:border-brand-default group-hover:bg-brand-default/5">
                 <link.icon className="h-5 w-5 text-text-tertiary transition-fast group-hover:text-brand-text" />
              </div>
              <h4 className="font-syne font-bold text-sm text-text-primary mb-1">{link.label}</h4>
              <p className="text-xs text-text-tertiary leading-relaxed mb-4">{link.desc}</p>
              <Button variant="ghost" className="h-8 p-0 text-brand-text hover:text-brand-hover text-xs font-bold uppercase tracking-widest">
                 Learn More <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
           </div>
         ))}
      </div>

      {/* Contact Help */}
      <div className="mt-12 bg-bg-surface border-2 border-dashed border-border-default rounded-2xl p-10 text-center space-y-4">
         <div className="h-12 w-12 rounded-full bg-bg-sunken flex items-center justify-center mx-auto mb-4 border border-border-default">
            <HelpCircle className="h-6 w-6 text-text-secondary" />
         </div>
         <h3 className="font-syne font-bold text-xl text-text-primary tracking-tight">Need more help?</h3>
         <p className="text-text-secondary font-dmsans max-w-md mx-auto">Our internal infrastructure team is available on the <span className="font-bold text-brand-text cursor-pointer hover:underline">#engineering-help</span> Slack channel for real-time support.</p>
         <Button onClick={() => { window.location.href = '/dashboard/tickets/new'; }} className="bg-brand-default hover:bg-brand-hover text-white font-bold h-10 px-8 shadow-brand">
            Open Support Ticket
         </Button>
      </div>
    </div>
  );
}
