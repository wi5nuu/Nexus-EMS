"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Layers, 
  Target, 
  TrendingUp, 
  Zap,
  Calendar,
  Users,
  AlertCircle,
  PlusCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/projects");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="h-8 w-8 text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight">Initiate New Project</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-bg-surface border-border-default shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 blur-[100px] rounded-full pointer-events-none" />
            <CardHeader>
              <CardTitle className="font-syne text-lg">Project Identification</CardTitle>
              <CardDescription className="font-dmsans text-[13px]">Register a new strategic initiative within Nexus Corp.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="new-project-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="project-name" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                      Project Name
                    </Label>
                    <Input 
                      id="project-name" 
                      placeholder="Enterprise Integration Platform v2" 
                      className="h-11 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[14px] focus:ring-brand-default"
                      required
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="project-key" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                      Key
                    </Label>
                    <Input 
                      id="project-key" 
                      placeholder="EIP" 
                      className="h-11 bg-bg-sunken border-border-default text-text-primary font-mono text-[14px] uppercase focus:ring-brand-default"
                      required
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                    Strategic Description
                  </Label>
                  <textarea 
                    id="project-description" 
                    placeholder="Provide a detailed roadmap, goal, and the problem this project aims to solve." 
                    rows={4}
                    className="flex w-full rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast resize-none font-dmsans"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label htmlFor="start-date" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                        Target Start Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                        <Input 
                          id="start-date" 
                          type="date"
                          className="h-10 pl-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[13px] focus:ring-brand-default"
                          required
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="due-date" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                        Delivery Milestone
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                        <Input 
                          id="due-date" 
                          type="date"
                          className="h-10 pl-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[13px] focus:ring-brand-default"
                          required
                        />
                      </div>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border-subtle">
                   <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-text-primary">Resource Allocation</p>
                        <p className="text-xs text-text-tertiary font-dmsans">Assign initial core team to this project.</p>
                     </div>
                     <Button type="button" variant="outline" size="sm" className="h-8 border-border-default text-[11px] font-bold">
                        <Users className="h-3 w-3 mr-2" /> Select Team
                     </Button>
                   </div>
                   <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400 border border-violet-500/20">AK</div>
                      <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px] font-bold text-rose-400 border border-rose-500/20">+</div>
                   </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[11px] text-text-tertiary font-medium bg-bg-panel/50 px-3 py-1.5 rounded border border-border-subtle">
                      <Zap className="h-3 w-3 text-amber-500" />
                      Requires architecture review first
                   </div>
                   <div className="flex items-center gap-3">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => router.back()}
                        className="text-text-secondary hover:text-text-primary text-xs"
                      >
                        Discard
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-brand-default hover:bg-brand-hover text-white font-bold px-8 shadow-brand h-10 text-[13px] tracking-wide"
                      >
                        {loading ? "Registering..." : "PROCEED WITH PROJECT"}
                      </Button>
                   </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-bg-panel/30 border-border-subtle backdrop-blur-md">
              <CardHeader>
                 <CardTitle className="text-sm font-syne uppercase tracking-wider text-text-secondary">Project Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {[
                   { icon: Target, title: "Objective Alignment", desc: "Ensure project goals match Nexus' strategic roadmap for Q3." },
                   { icon: TrendingUp, title: "KPI Definition", desc: "Success metrics must be quantifiable and measurable." },
                   { icon: Layers, title: "Tech Stack Approval", desc: "All new libraries must be approved by the Infrastructure team." },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-3">
                      <div className="h-6 w-6 rounded bg-brand-muted flex items-center justify-center shrink-0">
                         <item.icon className="h-3 w-3 text-brand-text" />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[12px] font-bold text-text-primary">{item.title}</p>
                         <p className="text-[10px] text-text-tertiary font-medium leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <div className="p-5 rounded-xl border border-border-default bg-gradient-to-br from-violet-500/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 text-violet-500/10 group-hover:scale-110 transition-fast">
                 <Zap className="h-16 w-16" />
              </div>
              <h3 className="text-[13px] font-bold text-text-primary mb-1">Architecture Review</h3>
              <p className="text-[11px] text-text-tertiary font-medium mb-3">All new projects require an initial Tier-1 security and architecture audit.</p>
              <Button variant="outline" className="w-full h-8 text-[11px] font-bold border-violet-500/20 text-violet-400 hover:bg-violet-500/10">
                 Read documentation
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
