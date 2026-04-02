"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Mail, MapPin, 
  Briefcase, Star, 
  Edit3, UserX,
  Award, ShieldCheck,
  History as HistoryIcon,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EmployeeProfilePage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: employeeData, isLoading: isEmpLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => apiFetch<{data: { id?: string, firstName?: string, lastName?: string, email?: string, phone?: string, location?: string, status?: string, createdAt?: string, employeeProfile?: { teamId?: string, jobTitle?: string, departmentId?: string, joinDate?: string, department?: { name?: string }, team?: { name?: string, leadId?: string } } }}>(`/api/v1/hr/employees/${id}`),
  });

  const empRaw = employeeData?.data;

  // New: Fetch Departments for selection
  const { data: deptsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiFetch<{data: Array<{id: string, name: string}>}>('/api/v1/organization/departments'),
  });

  // New: Fetch Teams for selection
  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => apiFetch<{data: Array<{id: string, name: string, departmentId: string}>}>('/api/v1/hr/teams'),
  });

  // New: Fetch Team Members for the current employee's team
  const teamId = empRaw?.employeeProfile?.teamId;
  const { data: teamMembersData } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => apiFetch<{data: Array<{user: {id: string, firstName: string, lastName: string}}>}>(`/api/v1/hr/teams/${teamId}/members`),
    enabled: !!teamId,
  });

  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    departmentId: "",
    teamId: "",
  });

  useEffect(() => {
    if (empRaw) {
      setEditData({
        firstName: empRaw.firstName || "",
        lastName: empRaw.lastName || "",
        jobTitle: empRaw.employeeProfile?.jobTitle || "",
        departmentId: empRaw.employeeProfile?.departmentId || "",
        teamId: empRaw.employeeProfile?.teamId || "none",
      });
    }
  }, [empRaw, isEditOpen]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiFetch(`/api/v1/hr/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      toast.success("Identity profile synchronized with central datastore.");
      setIsEditOpen(false);
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : String(err)),
  });

  const handleSaveEdit = () => {
    updateMutation.mutate({
      firstName: editData.firstName,
      lastName: editData.lastName,
      jobTitle: editData.jobTitle,
      departmentId: editData.departmentId,
      teamId: editData.teamId === "none" ? null : editData.teamId,
    });
  };

  const departments = deptsData?.data || [];
  const teams = teamsData?.data || [];
  const teamMembers = teamMembersData?.data || [];

  const filteredTeams = teams.filter(t => t.departmentId === editData.departmentId);
  
  if (isEmpLoading) {
    return <div className="max-w-6xl mx-auto space-y-6 pt-10 text-center text-text-tertiary animate-pulse font-mono text-sm">Loading Neural Profile...</div>;
  }

  if (!empRaw) {
    return <div className="max-w-6xl mx-auto space-y-6 pt-10 text-center text-crimson-500 font-syne font-bold">Employee Not Found.</div>;
  }

  const emp = {
    id: empRaw.id,
    name: `${empRaw.firstName} ${empRaw.lastName}`,
    email: empRaw.email,
    role: empRaw.employeeProfile?.jobTitle || 'Employee',
    dept: empRaw.employeeProfile?.department?.name || 'General',
    level: "Senior", // Default derivation
    status: empRaw.status === 'ACTIVE' ? 'Active' : 'Deactivated',
    joined: new Date(empRaw.employeeProfile?.joinDate || Date.now()).toLocaleDateString("en-US", { month: 'short', year: 'numeric' }),
  };

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
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-none h-8 border-border-default text-text-secondary hover:text-text-primary text-xs font-semibold bg-bg-surface hover:bg-bg-elevated transition-fast"
                >
                   <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-bg-surface border-border-default shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="font-syne text-text-primary text-xl font-bold">Edit System Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">First Name</Label>
                      <Input 
                        value={editData.firstName} 
                        onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                        className="h-9 bg-bg-sunken border-border-default text-text-primary text-[13px]" 
                      />
                    </div>
                    <div className="grid gap-2">
                       <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Last Name</Label>
                       <Input 
                        value={editData.lastName} 
                        onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                        className="h-9 bg-bg-sunken border-border-default text-text-primary text-[13px]" 
                       />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Operational Role</Label>
                    <Input 
                      value={editData.jobTitle} 
                      onChange={(e) => setEditData({...editData, jobTitle: e.target.value})}
                      className="h-9 bg-bg-sunken border-border-default text-text-primary text-[13px]" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Primary Department</Label>
                    <Select value={editData.departmentId} onValueChange={(val) => setEditData({...editData, departmentId: val, teamId: "none" })}>
                      <SelectTrigger className="h-9 bg-bg-sunken border-border-default">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-surface border-border-default">
                        {departments.map((d: {id: string, name: string}) => (
                           <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Assigned Team</Label>
                    <Select value={editData.teamId} onValueChange={(val) => setEditData({...editData, teamId: val})}>
                      <SelectTrigger className="h-9 bg-bg-sunken border-border-default">
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-surface border-border-default">
                        <SelectItem value="none">Independent Contributor</SelectItem>
                        {filteredTeams.map((t: {id: string, name: string}) => (
                           <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="h-9 text-[11px] font-bold border-border-default">CANCEL</Button>
                  <Button 
                    type="button" 
                    disabled={updateMutation.isPending}
                    onClick={handleSaveEdit} 
                    className="h-9 text-[11px] font-bold bg-brand-default text-white hover:bg-brand-hover shadow-brand"
                  >
                    {updateMutation.isPending ? <div className="h-3.5 w-3.5 animate-spin mr-2 border-2 border-white border-t-transparent rounded-full" /> : <Edit3 className="h-3.5 w-3.5 mr-2" />}
                    SYNC PROFILE
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
           <Button 
             variant="outline" 
             className="flex-1 sm:flex-none h-8 border-border-default text-crimson-500 hover:bg-crimson-500/5 text-xs font-semibold bg-bg-surface transition-fast"
             onClick={() => confirm(`CAUTION: Are you sure you want to DEACTIVATE ${emp.name}? This action is restricted to Tier 3 Admin only.`)}
           >
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
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-bg-surface shadow-2xl group-hover:scale-105 transition-all duration-500 cursor-pointer">
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
                    <div className="text-center p-3 rounded-xl bg-bg-sunken/50 border border-border-subtle hover:bg-bg-elevated transition-fast cursor-pointer">
                       <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase mb-1">Joined</p>
                       <p className="text-xs font-bold text-text-primary">{emp.joined}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-bg-sunken/50 border border-border-subtle hover:bg-bg-elevated transition-fast cursor-pointer">
                       <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase mb-1">Level</p>
                       <p className="text-xs font-bold text-text-primary">{emp.level}</p>
                    </div>
                 </div>
              </CardContent>
              <div className="border-t border-border-subtle px-6 py-4 bg-bg-panel/30 space-y-3">
                 <div className="flex items-center gap-3 text-xs text-text-secondary hover:text-brand-text transition-fast cursor-pointer group">
                    <Mail className="h-3.5 w-3.5 text-text-tertiary group-hover:text-brand-text" />
                    <span>{emp.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-text-secondary hover:text-brand-text transition-fast cursor-pointer group">
                    <Briefcase className="h-3.5 w-3.5 text-text-tertiary group-hover:text-brand-text" />
                    <span>{emp.dept} Department</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-text-secondary hover:text-brand-text transition-fast cursor-pointer group">
                    <MapPin className="h-3.5 w-3.5 text-text-tertiary group-hover:text-brand-text" />
                    <span>Jakarta, Indonesia (HQ)</span>
                 </div>
              </div>
           </Card>

           <Card className="bg-bg-surface border-border-default shadow-sm overflow-hidden group hover:border-brand-default transition-all duration-300">
              <CardHeader className="pb-3 border-b border-border-subtle">
                 <CardTitle className="text-xs font-syne font-bold uppercase tracking-widest text-text-tertiary">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 {[
                   { label: "Quarterly Target", value: 94, color: "bg-emerald-500" },
                   { label: "Commit Consistency", value: 88, color: "bg-brand-default" },
                   { label: "SLA Adherence", value: 76, color: "bg-amber-500" },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2 group/bar cursor-pointer">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-text-secondary group-hover/bar:text-text-primary transition-fast">{stat.label}</span>
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
                { icon: Award, label: "Total Awards", value: "14", color: "text-amber-500", bg: "bg-amber-500/10", action: "Award history" },
                { icon: ShieldCheck, label: "Security Level", value: "Tier 1", color: "text-emerald-500", bg: "bg-emerald-500/10", action: "Security clearance" },
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => alert(`Viewing ${item.action}...`)}
                  className="bg-bg-surface border border-border-default p-4 rounded-2xl flex items-center gap-4 shadow-sm group hover:border-brand-default transition-fast cursor-pointer"
                >
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

              <Card className="bg-bg-surface border-border-default shadow-sm group hover:border-brand-default transition-all duration-300">
                 <CardHeader className="border-b border-border-subtle pb-4 bg-bg-panel/10">
                    <div className="flex items-center gap-2">
                       <Star className="h-4 w-4 text-amber-500" />
                       <CardTitle className="font-syne text-[15px] font-bold uppercase tracking-tight">Team Collaboration</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="pt-6">
                     {!teamId || teamId === "none" ? (
                        <div className="p-8 border-2 border-dashed border-border-subtle rounded-xl text-center bg-bg-panel/10 hover:bg-bg-panel/20 transition-all">
                           <Users className="h-8 w-8 text-text-tertiary mx-auto mb-3 opacity-20" />
                           <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3">No Active Team Deployment</p>
                           <Button 
                             onClick={() => setIsEditOpen(true)}
                             variant="outline" 
                             className="h-8 text-[10px] font-bold border-brand-default/30 text-brand-text hover:bg-brand-default/5"
                           >
                              ASSIGN OPERATIONAL UNIT
                           </Button>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-4">
                           <Dialog>
                             <DialogTrigger asChild>
                               <div className="p-4 rounded-xl border border-border-subtle hover:bg-bg-sunken hover:border-brand-default/50 transition-all duration-300 cursor-pointer group shadow-sm bg-bg-panel/20">
                                  <div className="flex justify-between items-center mb-4">
                                     <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[14px] font-syne font-bold text-text-primary tracking-tight group-hover:text-brand-text transition-fast">{empRaw.employeeProfile?.team?.name || "Assigned Team"}</span>
                                     </div>
                                     <div className="bg-emerald-500/10 text-emerald-500 border-none rounded-none text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase">Active</div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                        <div className="flex -space-x-3">
                                           {teamMembers.slice(0, 5).map((m: {user: {firstName: string, lastName?: string, id?: string}}, idx: number) => (
                                             <Avatar key={idx} className="h-7 w-7 rounded-none border-2 border-bg-surface bg-bg-sunken shrink-0 shadow-sm ring-1 ring-black/5">
                                                 <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user.firstName}`} />
                                                 <AvatarFallback className="text-[10px] font-bold text-text-tertiary">{m.user.firstName[0]}</AvatarFallback>
                                             </Avatar>
                                           ))}
                                        </div>
                                        {teamMembers.length > 5 && (
                                           <span className="text-[10px] text-text-tertiary font-bold ml-1 uppercase">+{teamMembers.length - 5} Others</span>
                                        )}
                                     </div>
                                     <Button variant="ghost" size="sm" className="h-6 text-[9px] font-bold text-brand-text uppercase group-hover:underline">VIEW SQUAD</Button>
                                  </div>
                               </div>
                             </DialogTrigger>
                             <DialogContent className="max-w-md bg-bg-surface border-border-default shadow-2xl p-0 overflow-hidden">
                               <div className="h-1.5 w-full bg-brand-default" />
                               <DialogHeader className="p-6 border-b border-border-subtle bg-bg-panel/30">
                                 <DialogTitle className="font-syne text-lg flex items-center gap-2 uppercase tracking-tight font-bold">
                                   <Star className="h-5 w-5 text-brand-text" /> 
                                   Team Squad: {empRaw.employeeProfile?.team?.name}
                                 </DialogTitle>
                                 <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mt-1">Operational Unit Deployment Ledger</p>
                               </DialogHeader>
                               <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                                 {teamMembers.map((m: {jobTitle?: string, user: {id: string, firstName: string, lastName: string}}) => (
                                   <div key={m.user.id} className="flex items-center justify-between p-3 bg-bg-panel/50 border border-border-subtle hover:border-brand-default/30 transition-all group">
                                      <div className="flex items-center gap-3">
                                         <Avatar className="h-10 w-10 rounded-none border border-border-subtle shadow-sm group-hover:scale-105 transition-fast">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user.firstName}`} />
                                            <AvatarFallback className="font-bold">{m.user.firstName[0]}</AvatarFallback>
                                         </Avatar>
                                         <div>
                                            <p className="text-xs font-bold text-text-primary capitalize">{m.user.firstName} {m.user.lastName} {m.user.id === id && "(You)"}</p>
                                            <p className="text-[10px] text-brand-text font-bold uppercase tracking-tighter opacity-80">{m.jobTitle || "Team Member"}</p>
                                         </div>
                                      </div>
                                      {m.user.id === empRaw.employeeProfile?.team?.leadId && (
                                         <div className="bg-amber-500/10 text-amber-500 border-none text-[9px] font-bold tracking-widest rounded-none px-2 py-0.5">LEAD</div>
                                      )}
                                   </div>
                                 ))}
                               </div>
                             </DialogContent>
                           </Dialog>
                        </div>
                     )}
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
