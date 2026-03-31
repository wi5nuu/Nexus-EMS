"use client";

import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Mail, MapPin, 
  Briefcase, Star, 
  Edit3, UserX,
  Award, ShieldCheck,
  History as HistoryIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function EmployeeProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  interface EmployeeProfile {
    name: string;
    email: string;
    role: string;
    dept: string;
    level: string;
    status: string;
    joined: string;
  }

  // Mock data fetching based on ID
  const employees: Record<string, EmployeeProfile> = {
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
           <Button variant="outline" className="flex-1 sm:flex-none h-8 border-border-default text-crimson-500 hover:bg-crimson-500/5 text-xs font-semibold bg-bg-surface transition-fast">
              <UserX className="h-3.5 w-3.5 mr-2" /> Deactivate
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Basic Info Card */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-bg-surface border-border-default shadow-sm overflow-hidden border-t-4 border-brand-default">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                 <div className="relative inline-block group">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-bg-surface shadow-2xl group-hover:scale-105 transition-all duration-500">
                       <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} />
                       <AvatarFallback className="bg-bg-sunken text-2xl font-bold text-text-secondary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-bg-surface shadow-sm",
                      emp.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                 </div>
                 <h2 className="mt-4 font-syne font-bold text-2xl text-text-primary tracking-tight">{emp.name}</h2>
                 <p className="text-brand-text font-mono font-bold text-[11px] uppercase tracking-[0.2em] mt-1">{emp.role}</p>
                 
                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-bg-sunken/50 border border-border-subtle">
                       <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase mb-1">Joined</p>
                       <p className="text-xs font-bold text-text-primary">{emp.joined}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-bg-sunken/50 border border-border-subtle">
                       <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase mb-1">Level</p>
                       <p className="text-xs font-bold text-text-primary">{emp.level}</p>
                    </div>
                 </div>
              </CardContent>
              <div className="border-t border-border-subtle px-6 py-4 bg-bg-panel/30 space-y-3">
                 <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <Mail className="h-3.5 w-3.5 text-text-tertiary" />
                    <span>{emp.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <Briefcase className="h-3.5 w-3.5 text-text-tertiary" />
                    <span>{emp.dept} Department</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <MapPin className="h-3.5 w-3.5 text-text-tertiary" />
                    <span>Jakarta, Indonesia (HQ)</span>
                 </div>
              </div>
           </Card>

           <Card className="bg-bg-surface border-border-default shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-border-subtle">
                 <CardTitle className="text-xs font-syne font-bold uppercase tracking-widest text-text-tertiary">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 {[
                   { label: "Quarterly Target", value: 94, color: "bg-emerald-500" },
                   { label: "Commit Consistency", value: 88, color: "bg-brand-default" },
                   { label: "SLA Adherence", value: 76, color: "bg-amber-500" },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-text-secondary">{stat.label}</span>
                         <span className="text-text-primary">{stat.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-bg-sunken rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full transition-all duration-1000", stat.color)} style={{ width: `${stat.value}%` }} />
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Detailed Info & Timeline */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Award, label: "Total Awards", value: "14", color: "text-amber-500", bg: "bg-amber-500/10" },
                { icon: ShieldCheck, label: "Security Level", value: "Tier 1", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              ].map((item, i) => (
                <div key={i} className="bg-bg-surface border border-border-default p-4 rounded-2xl flex items-center gap-4 shadow-sm group hover:border-brand-default transition-fast cursor-pointer">
                   <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-fast", item.bg)}>
                      <item.icon className={cn("h-6 w-6", item.color)} />
                   </div>
                   <div>
                      <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">{item.label}</p>
                      <p className="text-lg font-bold text-text-primary">{item.value}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="space-y-6">
              <Card className="bg-bg-surface border-border-default shadow-sm border-l-4 border-l-brand-default">
                 <CardHeader className="border-b border-border-subtle pb-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-text-primary">
                          <HistoryIcon className="h-4 w-4 text-brand-text" />
                          <CardTitle className="font-syne text-[15px]">Career Milestone Timeline</CardTitle>
                       </div>
                       <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-text-tertiary hover:text-brand-text transition-fast">VIEW ALL</Button>
                    </div>
                 </CardHeader>
                 <CardContent className="pt-6">
                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
                       {[
                         { title: "Promoted to Principal Engineer", date: "Jan 2026", desc: "Recognized for leading the Nexus EMS architecture overhaul." },
                         { title: "Joined Nexus Corp", date: "Mar 2023", desc: "Started as Senior Fullstack Engineer in the Core platform team." },
                       ].map((item, i) => (
                         <div key={i} className="relative pl-10 group">
                            <div className="absolute left-[3px] top-1 h-4 w-4 rounded-full border-2 border-bg-surface bg-brand-default shadow-brand z-10 group-hover:scale-125 transition-fast" />
                            <p className="text-[10px] font-mono font-bold text-brand-text uppercase tracking-widest">{item.date}</p>
                            <h4 className="text-[14px] font-bold text-text-primary mt-1">{item.title}</h4>
                            <p className="text-xs text-text-tertiary mt-1 font-medium leading-relaxed">{item.desc}</p>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-bg-surface border-border-default shadow-sm">
                 <CardHeader className="border-b border-border-subtle pb-4">
                    <div className="flex items-center gap-2">
                       <Star className="h-4 w-4 text-amber-500" />
                       <CardTitle className="font-syne text-[15px]">Team Collaboration</CardTitle>
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
