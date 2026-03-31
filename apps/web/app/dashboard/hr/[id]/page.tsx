"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  Briefcase, Calendar, Star, 
  MessageSquare, Edit3, UserX,
  History, Target, Award,
  CheckCircle2, Clock, Zap, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function EmployeeProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Mock data fetching based on ID
  const employees: Record<string, any> = {
    "1": { name: "Arif Kurniawan", email: "arif@nexus.co", role: "Principal Engineer", dept: "Engineering", level: "Senior", status: "Active", joined: "Mar 2023" },
    "2": { name: "Rania Santoso", email: "rania@nexus.co", role: "Product Manager", dept: "Product", level: "Lead", status: "On Leave", joined: "Jul 2022" },
    "3": { name: "Damar Haryanto", email: "damar@nexus.co", role: "DevOps Engineer", dept: "Infrastructure", level: "Mid", status: "Active", joined: "Sep 2023" },
    "4": { name: "Putri Andriani", email: "putri@nexus.co", role: "Frontend Engineer", dept: "Engineering", level: "Junior", status: "Active", joined: "Jan 2024" },
    "5": { name: "Budi Mahendra", email: "budi@nexus.co", role: "QA Engineer", dept: "Quality", level: "Mid", status: "Active", joined: "Jun 2023" },
    "6": { name: "Sari Wijaya", email: "sari@nexus.co", role: "HR Manager", dept: "Human Resources", level: "Senior", status: "Active", joined: "Jan 2022" },
  };

  const emp = employees[id] || employees["1"];
  const initials = emp.name.split(" ").map((n: string) => n[0]).join("").toUpperCase();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="h-8 w-8 text-text-secondary hover:text-text-primary transition-fast"
           >
             <ArrowLeft className="h-4 w-4" />
           </Button>
           <div className="space-y-0.5">
              <nav className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
                 <span className="cursor-pointer hover:text-brand-text transition-fast" onClick={() => router.push("/dashboard/hr")}>HR</span>
                 <span>/</span>
                 <span className="text-text-secondary">Profile</span>
              </nav>
              <h1 className="font-syne font-bold text-xl text-text-primary tracking-tight">Employee Details</h1>
           </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Button variant="outline" className="flex-1 sm:flex-none h-8 border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold bg-bg-surface hover:bg-bg-elevated transition-fast">
              <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Profile
           </Button>
           <Button className="flex-1 sm:flex-none h-8 bg-brand-default hover:bg-brand-hover text-white text-xs font-bold transition-fast shadow-brand">
              <MessageSquare className="h-3.5 w-3.5 mr-2" /> Message
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-bg-surface border-border-default shadow-sm overflow-hidden text-center scale-in">
              <div className="h-20 bg-gradient-to-r from-brand-default/20 to-violet-500/10" />
              <CardContent className="px-6 pb-6 -mt-10">
                 <div className="relative inline-block group">
                    <Avatar className="h-24 w-24 border-4 border-bg-surface shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-fast cursor-pointer">
                       <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} />
                       <AvatarFallback className="bg-brand-muted text-brand-text font-bold text-xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-bg-surface",
                      emp.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                 </div>
                 <h2 className="mt-4 font-syne font-bold text-xl text-text-primary">{emp.name}</h2>
                 <p className="text-xs font-mono font-bold text-text-tertiary uppercase tracking-widest mt-1">{emp.role}</p>
                 
                 <div className="mt-6 grid grid-cols-2 gap-px bg-border-subtle border border-border-subtle rounded-lg overflow-hidden">
                    <div className="bg-bg-surface p-3">
                       <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter">Department</p>
                       <p className="text-xs font-semibold text-text-primary mt-1">{emp.dept}</p>
                    </div>
                    <div className="bg-bg-surface p-3">
                       <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter">Level</p>
                       <p className="text-xs font-semibold text-text-primary mt-1">{emp.level}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-bg-surface border-border-default shadow-sm">
              <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/30">
                 <CardTitle className="text-[11px] font-syne font-bold uppercase tracking-widest text-text-secondary italic">Contact Intel</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                 {[
                   { icon: Mail, label: "Work Email", value: emp.email },
                   { icon: Phone, label: "Work Phone", value: "+62 821-4456-7890" },
                   { icon: MapPin, label: "Location", value: "Jakarta (SCBD)" },
                   { icon: Calendar, label: "Date Joined", value: emp.joined },
                 ].map((i) => (
                   <div key={i.label} className="flex items-center gap-3 group">
                      <div className="h-8 w-8 rounded-lg bg-bg-sunken border border-border-default flex items-center justify-center text-text-tertiary transition-fast group-hover:text-brand-text group-hover:border-brand-default/30">
                         <i.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                         <p className="text-[10px] font-bold uppercase text-text-tertiary tracking-tighter">{i.label}</p>
                         <p className="text-[13px] font-medium text-text-primary truncate">{i.value}</p>
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Button variant="ghost" className="w-full h-10 text-crimson-500 hover:bg-crimson-500/10 transition-fast text-xs font-bold uppercase tracking-widest group">
              <UserX className="h-4 w-4 mr-2 opacity-50 group-hover:opacity-100" /> Deactivate Employee
           </Button>
        </div>

        {/* Main Content Areas */}
        <div className="lg:col-span-8 space-y-6">
           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Performance", value: "4.8", unit: "/5", icon: Star, color: "text-amber-500" },
                { label: "Projects", value: "12", unit: "active", icon: Zap, color: "text-violet-500" },
                { label: "SLA Rank", value: "Top 3", unit: "%", icon: Award, color: "text-emerald-500" },
                { label: "Stability", value: "98", unit: "%", icon: ShieldCheck, color: "text-sapphire-500" },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-surface border border-border-default rounded-xl p-4 shadow-sm hover:border-brand-default/40 transition-fast group">
                   <div className="flex items-center justify-between mb-2">
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                      <div className="h-1.5 w-1.5 rounded-full bg-border-strong group-hover:bg-brand-default transition-fast" />
                   </div>
                   <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{stat.label}</p>
                   <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-dmsans font-black text-text-primary tracking-tight">{stat.value}</span>
                      <span className="text-[10px] font-bold text-text-tertiary">{stat.unit}</span>
                   </div>
                </div>
              ))}
           </div>

           {/* Tabs Simulation (Simplified with Card Layout) */}
           <div className="space-y-6">
              {/* Mission History */}
              <Card className="bg-bg-surface border-border-default shadow-sm border-l-4 border-l-brand-default">
                 <CardHeader className="border-b border-border-subtle pb-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-text-secondary" />
                          <CardTitle className="text-sm font-syne font-bold uppercase tracking-wider text-text-primary">Work History & Impact</CardTitle>
                       </div>
                       <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-brand-text">View Full Stack</Button>
                    </div>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-6">
                    {[
                      { year: "2024", mission: "Platform Security Patch v4.2", role: "Main Contributor", impact: "Eliminated 2 critical CVEs" },
                      { year: "2023", mission: "Nexus Core Migration (AWS)", role: "Infra Lead", impact: "Reduced latency by 45ms" },
                      { year: "2023", mission: "Internal Dashboard Overhaul", role: "Architect", impact: "100% design compliance" },
                    ].map((m, i) => (
                      <div key={i} className="flex gap-4 group">
                         <div className="h-10 w-[2px] bg-border-subtle mt-1 relative group-last:bg-transparent">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-bg-surface border-2 border-brand-default" />
                         </div>
                         <div className="flex-1 pb-6 group-last:pb-0">
                            <div className="flex items-center gap-2">
                               <span className="text-[11px] font-mono font-bold text-text-tertiary">{m.year}</span>
                               <span className="h-1 w-1 rounded-full bg-border-strong" />
                               <h4 className="text-[14px] font-bold text-text-primary">{m.mission}</h4>
                            </div>
                            <p className="text-[12px] text-text-secondary mt-1 font-medium">{m.role} · <span className="text-emerald-500 italic">{m.impact}</span></p>
                         </div>
                      </div>
                    ))}
                 </CardContent>
              </Card>

              {/* Team Collaboration */}
              <Card className="bg-bg-surface border-border-default shadow-sm">
                 <CardHeader className="border-b border-border-subtle pb-4">
                    <div className="flex items-center gap-2">
                       <Briefcase className="h-4 w-4 text-text-secondary" />
                       <CardTitle className="text-sm font-syne font-bold uppercase tracking-wider text-text-primary">Associated Teams</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { team: "Engineering Core", count: 12, status: "Active" },
                         { team: "Security Tiger Team", count: 4, status: "Standby" },
                       ].map((t, i) => (
                         <div key={i} className="p-4 rounded-xl border border-border-subtle hover:bg-bg-sunken transition-fast cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-[13px] font-bold text-text-primary">{t.team}</span>
                               <span className={cn(
                                 "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                 t.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-text-tertiary/10 text-text-tertiary"
                               )}>{t.status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="flex -space-x-2">
                                  {[1, 2, 3].map(a => (
                                    <div key={a} className="h-6 w-6 rounded-full border-2 border-bg-surface bg-bg-sunken flex items-center justify-center text-[10px] font-bold text-text-tertiary">
                                       {a}
                                    </div>
                                  ))}
                               </div>
                               <span className="text-[11px] text-text-tertiary font-medium">+{t.count - 3} others</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
