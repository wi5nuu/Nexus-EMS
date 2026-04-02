"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Briefcase, 
  Globe, 
  Mail,
  ShieldCheck,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/auth";
import { toast } from "sonner";

export default function NewEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiFetch("/api/v1/hr/employees", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success(`${formData.firstName} has been onboarded successfully.`);
      router.push("/dashboard/hr");
    } catch (err: unknown) {
      toast.error(`Onboarding failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
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
          <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight">Onboard New Employee</h1>
          <p className="text-xs text-text-tertiary font-dmsans">Register a new talent into the Vanguard Corp workspace.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Internal Profile */}
          <Card className="bg-bg-surface border-border-default shadow-lg">
             <CardHeader className="pb-4 border-b border-border-subtle">
                <CardTitle className="text-sm font-syne uppercase tracking-wider text-text-secondary">Core Profile</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">First Name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="Wisnu" 
                        className="h-10 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[13px] focus:ring-brand-default" 
                        required 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Last Name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Dev" 
                        className="h-10 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[13px] focus:ring-brand-default" 
                        required 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-2 text-left">
                   <Label htmlFor="email" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Work Email</Label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Wisnu@Vanguard.co" 
                        className="h-10 pl-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[13px] focus:ring-brand-default" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Department</Label>
                      <select className="flex h-10 w-full rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-sm text-text-primary font-dmsans focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast" defaultValue="ENG">
                        <option value="ENG">Engineering</option>
                        <option value="PRD">Product</option>
                        <option value="HR">Human Resources</option>
                        <option value="INF">Infrastructure</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Employment Level</Label>
                      <select className="flex h-10 w-full rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-sm text-text-primary font-dmsans focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast" defaultValue="JR">
                        <option value="JR">Junior</option>
                        <option value="MD">Mid-Level</option>
                        <option value="SR">Senior</option>
                        <option value="PR">Principal</option>
                      </select>
                   </div>
                </div>
             </CardContent>
          </Card>

          {/* Job Details */}
          <Card className="bg-bg-surface border-border-default shadow-lg overflow-hidden">
             <CardHeader className="pb-4 border-b border-border-subtle flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-syne uppercase tracking-wider text-text-secondary">Position Details</CardTitle>
                <div className="flex items-center gap-1.5 text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20">
                   <Briefcase className="h-3 w-3" /> Full-time
                </div>
             </CardHeader>
             <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                   <Label htmlFor="job-title" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Official Job Title</Label>
                   <Input 
                    id="job-title" 
                    placeholder="Senior Backend Engineer" 
                    className="h-10 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[13px] focus:ring-brand-default" 
                    required 
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Workspace Location</Label>
                      <div className="relative">
                         <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                         <select className="flex h-10 w-full pl-9 rounded-md border border-border-default bg-bg-sunken py-2 text-sm text-text-primary font-dmsans focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast" defaultValue="JKT">
                           <option value="JKT">Office (Jakarta)</option>
                           <option value="REM">Remote (WFH)</option>
                           <option value="SNG">Office (Singapore)</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="salary" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Salary Bracket (Annual)</Label>
                      <Input id="salary" placeholder="$120,000" className="h-10 bg-bg-sunken border-border-default text-text-primary font-mono text-[13px] focus:ring-brand-default" required />
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
           {/* Sidebar Checklist */}
           <Card className="bg-bg-panel/50 border-border-subtle backdrop-blur-sm sticky top-6">
              <CardHeader className="pb-3 border-b border-border-subtle">
                 <CardTitle className="text-[12px] font-syne font-bold uppercase tracking-widest text-text-secondary">Onboarding Check</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                 {[
                   { label: "Identity Verified", done: true },
                   { label: "Hardware Requested", done: true },
                   { label: "Compliance Agreement", done: false },
                   { label: "Benefits Enrollment", done: false },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between group">
                      <span className={cn("text-[13px] font-medium transition-fast", item.done ? "text-text-primary" : "text-text-tertiary group-hover:text-text-secondary")}>
                        {item.label}
                      </span>
                      {item.done ? (
                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                           <CheckCircle className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-bg-elevated border border-border-subtle" />
                      )}
                   </div>
                 ))}

                 <div className="pt-6 border-t border-border-subtle flex flex-col gap-3">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-brand-default hover:bg-brand-hover text-white font-bold h-10 text-[13px] tracking-wide shadow-brand rounded-none"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {loading ? "Registering Talent..." : "CONFIRM ONBOARDING"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => router.back()}
                      className="w-full text-text-secondary hover:text-text-primary text-[12px]"
                    >
                      Discard & Exit
                    </Button>
                 </div>

                 <div className="mt-4 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 text-violet-500/10 group-hover:scale-110 transition-fast">
                       <ShieldCheck className="h-10 w-10" />
                    </div>
                    <h4 className="text-[11px] font-bold text-violet-400 mb-1">PROMPT: NEW HIRE ACCESS</h4>
                    <p className="text-[10px] text-text-tertiary font-medium">Automatic system access will be provisioned within 15 minutes of onboarding.</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </form>
    </div>
  );
}
