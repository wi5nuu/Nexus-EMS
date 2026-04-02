"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { useSession } from "next-auth/react";

import { 
  MapPin, 
  Globe, 
  Users, 
  Plus, 
  MoreVertical,
  DollarSign,
  TrendingUp,
  Briefcase,
  Layers,
  Settings2,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { toast } from "sonner";


export default function OrganizationPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  // Security: Ensure only admins can access
  if (session && (session.user as { role?: string }).role !== 'ADMIN' && (session.user as { role?: string }).role !== 'SUPERADMIN') {
     // Optional: redirect('/dashboard');
  }

  const { data: orgData, isLoading: isLoadingOrg } = useQuery({
    queryKey: ["org-details"],
    queryFn: () => apiFetch<{ data: { name?: string, slug?: string } }>("/api/v1/organization/details"),
  });

  const { data: deptsData, isLoading: isLoadingDepts } = useQuery({
    queryKey: ["org-departments"],
    queryFn: () => apiFetch<{ data: Array<{ id: string, name: string, _count?: { employees: number, teams: number }, manager?: { firstName: string, lastName: string } }> }>("/api/v1/organization/departments"),
  });

  const { data: bandsData, isLoading: isLoadingBands } = useQuery({
    queryKey: ["org-salary-bands"],
    queryFn: () => apiFetch<{ data: Array<{ id: string, level: string, minSalary: number, maxSalary: number }> }>("/api/v1/organization/salary-bands"),
  });

  const org = orgData?.data;
  const departments = deptsData?.data || [];
  const salaryBands = bandsData?.data || [];

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiFetch("/api/v1/organization/details", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast.success("Organization global settings synchronized successfully.");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : String(err)),
  });

  const handleSave = () => {
    updateMutation.mutate({}); // Update with existing or modified data
  };

  if (isLoadingOrg || isLoadingDepts || isLoadingBands) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-bg-surface">
         <div className="h-8 w-8 border-4 border-brand-default border-t-transparent rounded-full animate-spin mb-4" />
         <p className="font-syne font-bold text-xs uppercase tracking-[0.2em] text-text-tertiary">Accessing Enterprise Infrastructure...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-6 px-4 sm:px-0 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="h-16 w-16 bg-white border border-border-default flex items-center justify-center text-4xl font-bold text-slate-800 shadow-xl rounded-none">
              {org?.name?.[0] || 'N'}
           </div>
           <div>
             <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight uppercase">
                {org?.name ? `${org.name} ORGANIZATION` : "Vanguard Corp ORGANIZATION"}
             </h1>
             <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-text-tertiary uppercase tracking-widest font-mono">
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {org?.slug || 'Vanguard'}.co</span>
                <span>·</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Jakarta SCBD, ID</span>
             </div>
           </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={updateMutation.isPending} 
          className="bg-brand-default hover:bg-brand-hover text-white font-bold h-11 px-8 shadow-brand rounded-none flex items-center gap-2 text-xs"
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {updateMutation.isPending ? "SYNCING..." : "COMMIT GLOBAL SETTINGS"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-bg-panel border-b border-border-default rounded-none p-0 h-12 justify-start px-6 gap-8">
           {["overview", "departments", "compensation", "integrations"].map(tab => (
             <TabsTrigger 
                key={tab} 
                value={tab} 
                className="h-full bg-transparent border-b-2 border-transparent data-[state=active]:border-brand-default data-[state=active]:text-brand-text rounded-none text-[11px] font-bold uppercase tracking-widest"
             >
                {tab}
             </TabsTrigger>
           ))}
        </TabsList>

        {/* ─── OVERVIEW TAB ─── */}
        <TabsContent value="overview" className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Talent", value: departments.reduce((acc: number, d: { _count?: { employees?: number } }) => acc + (d._count?.employees || 0), 0).toString(), icon: Users, trend: "Live" },
                { label: "Op-Ex Monthly", value: "$2.4M", icon: DollarSign, trend: "-2.1%" },
                { label: "Active Projs", value: "32", icon: Briefcase, trend: "+4" },
                { label: "Org Health", value: "97.2%", icon: TrendingUp, trend: "Stable" },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-panel border border-border-subtle p-5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-2 opacity-5 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                      <stat.icon className="h-12 w-12" />
                   </div>
                   <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{stat.label}</p>
                   <div className="flex items-end gap-3">
                      <p className="text-2xl font-bold text-text-primary font-syne leading-none">{stat.value}</p>
                      <span className="text-[10px] font-bold text-brand-text mb-0.5">{stat.trend}</span>
                   </div>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              <div className="lg:col-span-8">
                 <Card className="bg-bg-surface border-border-default rounded-none">
                    <CardHeader>
                       <CardTitle className="font-syne text-lg">General Profile</CardTitle>
                       <CardDescription className="text-xs">Primary identification and corporate branding.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Organization Name</Label>
                             <Input defaultValue={org?.name} className="h-10 bg-bg-panel rounded-none border-border-default" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Workspace Domain</Label>
                             <Input defaultValue={`${org?.slug}.co`} className="h-10 bg-bg-panel rounded-none border-border-default" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">HQ Office Location</Label>
                          <Input defaultValue="Sudirman Central Business District, Jakarta, ID" className="h-10 bg-bg-panel rounded-none border-border-default" />
                       </div>
                    </CardContent>
                 </Card>
              </div>
              <div className="lg:col-span-4 space-y-4">
                 <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Region Control</h3>
                 <div className="bg-bg-panel border border-border-subtle p-6 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-white border border-border-subtle flex items-center justify-center">🇮🇩</div>
                          <span className="text-xs font-bold">Indonesia (Main)</span>
                       </div>
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-none text-[9px] font-bold">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between opacity-50">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-white border border-border-subtle flex items-center justify-center">🇸🇬</div>
                          <span className="text-xs font-bold">Singapore Hub</span>
                       </div>
                       <span className="text-[9px] font-bold text-text-tertiary">DORMANT</span>
                    </div>
                    <Button variant="outline" className="w-full text-xs font-bold border-dashed border-border-strong text-text-tertiary h-10 hover:text-text-primary rounded-none">
                       + Add Region Entry
                    </Button>
                 </div>
              </div>
           </div>
        </TabsContent>

        {/* ─── DEPARTMENTS TAB ─── */}
        <TabsContent value="departments" className="p-6 space-y-4">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Active Departments</h3>
              <Button size="sm" className="h-8 bg-brand-default text-white font-bold text-[10px] rounded-none">
                 <Plus className="h-3 w-3 mr-1.5" /> NEW DEPT
              </Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.length === 0 ? (
                <div className="col-span-2 py-12 text-center border-2 border-dashed border-border-subtle">
                   <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">No departments configured for this entity.</p>
                </div>
              ) : departments.map((dept: { id: string, name: string, _count?: { employees?: number, teams?: number }, manager?: { firstName: string, lastName: string } }) => (
                <div key={dept.id} className="bg-bg-panel border border-border-subtle hover:border-brand-default/50 transition-all p-5 group relative overflow-hidden">
                   <div className="flex justify-between items-baseline mb-4">
                      <h4 className="font-syne font-bold text-lg">{dept.name}</h4>
                      <Badge variant="outline" className="bg-bg-surface border-border-strong text-[9px] rounded-none font-bold">
                         {dept._count?.employees || 0} TALENT
                      </Badge>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                         <span className="text-text-tertiary font-medium">Department Head</span>
                         <span className="font-bold text-text-secondary">
                            {dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : "Unassigned"}
                         </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="text-text-tertiary font-medium">Internal Teams</span>
                         <span className="font-bold text-text-primary">{dept._count?.teams || 0} teams active</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-text-tertiary uppercase mb-1.5">
                           <span>Operational Health</span>
                           <span className="text-emerald-500">98%</span>
                        </div>
                        <div className="h-1.5 w-full bg-border-subtle rounded-none overflow-hidden">
                           <div 
                              className="h-full bg-emerald-500 w-[98%]"
                           />
                        </div>
                      </div>
                   </div>
                   <div className="mt-6 flex gap-2">
                      <Button variant="outline" className="flex-1 h-8 text-[10px] font-bold bg-bg-surface hover:bg-bg-elevated rounded-none">
                         VIEW TEAM
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-bg-surface border-border-strong rounded-none">
                         <Settings2 className="h-3 w-3" />
                      </Button>
                   </div>
                </div>
              ))}
           </div>
        </TabsContent>

        {/* ─── COMPENSATION TAB ─── */}
        <TabsContent value="compensation" className="p-6 space-y-6">
           <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                 <Card className="bg-bg-surface border-border-default rounded-none shadow-xl border-t-4 border-t-brand-default">
                    <CardHeader>
                       <CardTitle className="font-syne text-lg">Global Salary Bands</CardTitle>
                       <CardDescription className="text-xs">Standardized pay scales across all functions.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                       <table className="w-full border-collapse">
                          <thead>
                             <tr className="bg-bg-panel border-b border-border-strong">
                                <th className="p-4 text-left text-[10px] font-bold text-text-tertiary uppercase tracking-widest w-24">Level</th>
                                <th className="p-4 text-left text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Role Description</th>
                                <th className="p-4 text-right text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-brand-text">Range (MTD)</th>
                                <th className="p-4 w-12"></th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                             {salaryBands.length === 0 ? (
                               <tr>
                                 <td colSpan={4} className="p-8 text-center text-xs font-bold text-text-tertiary uppercase">No salary bands defined.</td>
                               </tr>
                             ) : salaryBands.map((band: { id: string, level: string, minSalary?: number, maxSalary?: number }) => (
                               <tr key={band.id} className="hover:bg-bg-panel/30 transition-colors">
                                  <td className="p-4">
                                     <span className="text-xs font-bold text-text-primary px-2 py-1 bg-bg-elevated border border-border-strong">{band.level}</span>
                                  </td>
                                  <td className="p-4">
                                     <p className="text-[12px] font-bold text-text-secondary">Band {band.level} Role Class</p>
                                  </td>
                                  <td className="p-4 text-right">
                                     <span className="text-[12px] font-mono font-bold text-brand-text">
                                        IDR {Number(band.minSalary).toLocaleString()} - {Number(band.maxSalary).toLocaleString()}
                                     </span>
                                  </td>
                                  <td className="p-4 text-right">
                                     <button className="text-text-tertiary hover:text-text-primary p-1">
                                        <MoreVertical className="h-4 w-4" />
                                     </button>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                       <div className="p-4 bg-bg-panel/50 border-t border-border-subtle">
                          <Button variant="outline" className="w-full h-10 border-dashed border-border-strong text-text-tertiary hover:text-text-primary text-xs font-bold rounded-none">
                             + DEFINE NEW COMPENSATION BAND
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
              </div>
              <div className="w-full md:w-80 space-y-4">
                 <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Policy Controls</h3>
                 <div className="bg-bg-panel border border-border-subtle p-5 space-y-6">
                    <div className="space-y-3">
                       <p className="text-[11px] font-bold text-text-primary flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Auto-Increment Policy
                       </p>
                       <p className="text-[10px] text-text-tertiary leading-relaxed">
                          Standard annual 3.5% adjustment for all L1-L3 talent.
                       </p>
                       <Button variant="ghost" className="h-6 p-0 text-[10px] font-bold text-brand-text hover:bg-transparent">EDIT POLICY</Button>
                    </div>
                    <Separator className="bg-border-subtle" />
                    <div className="space-y-3">
                       <p className="text-[11px] font-bold text-text-primary flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          Bonus Pool Calculation
                       </p>
                       <p className="text-[10px] text-text-tertiary leading-relaxed">
                          Based on Departmental Performance Index (DPI).
                       </p>
                       <Button variant="ghost" className="h-6 p-0 text-[10px] font-bold text-brand-text hover:bg-transparent">EDIT CALCULATION</Button>
                    </div>
                 </div>
              </div>
           </div>
        </TabsContent>

        {/* ─── INTEGRATIONS TAB ─── */}
        <TabsContent value="integrations" className="p-6">
           <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-strong bg-bg-panel/20 text-center">
              <div className="h-12 w-12 bg-bg-surface border border-border-default flex items-center justify-center mb-4 rounded-none">
                 <Layers className="h-6 w-6 text-text-tertiary animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Connect Enterprise Ecosystem</h4>
              <p className="text-xs text-text-tertiary mt-2 max-w-xs">
                 Sync with SAP, Workday, or Oracle HCM to centralize your talent operations.
              </p>
              <Button className="mt-8 bg-brand-default hover:bg-brand-hover text-white font-bold h-10 px-8 rounded-none text-[11px] uppercase tracking-widest shadow-brand">
                 Request Enterprise Connector
              </Button>
           </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
