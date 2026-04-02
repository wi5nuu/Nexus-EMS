"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { 
  ShieldCheck, 
  Shield, 
  Activity, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Loader2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string | null;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  userCount?: number;
}

const RESOURCES = ["Tickets", "HR", "Projects", "Finance", "Infrastructure", "Security"];
const ACTIONS = ["Read", "Write", "Delete", "Manage"];

export default function RBACPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState("matrix");

  // Security: Ensure only admins can access
  if (session && (session.user as { role?: string }).role !== 'ADMIN' && (session.user as { role?: string }).role !== 'SUPERADMIN') {
     // Optional: redirect('/dashboard');
  }

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["rbac-roles"],
    queryFn: () => apiFetch<{ data: Role[] }>("/api/v1/rbac/roles"),
  });

  const { data: permsData } = useQuery({
    queryKey: ["rbac-permissions"],
    queryFn: () => apiFetch<{ data: Permission[] }>("/api/v1/rbac/permissions"),
  });

  const roles = rolesData?.data || [];
  const allPermissions = permsData?.data || [];

  // Initialize selected role once data is loaded
  if (!selectedRole && roles.length > 0) {
    setSelectedRole(roles[0]);
  }

  const updatePermissionsMutation = useMutation({
    mutationFn: (vars: { roleId: string; permissions: string[] }) => 
      apiFetch(`/api/v1/rbac/roles/${vars.roleId}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ permissions: vars.permissions }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rbac-roles"] });
      toast.success("Permissions synchronized across global clusters.");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : String(err)),
  });

  const handleTogglePermission = (resource: string, action: string) => {
    if (!selectedRole) return;
    
    const perm = allPermissions.find(p => p.resource.toLowerCase() === resource.toLowerCase() && p.action.toLowerCase() === action.toLowerCase());
    if (!perm) return;

    const currentPermIds = selectedRole.permissions.map(p => p.id);
    const newPermIds = currentPermIds.includes(perm.id)
      ? currentPermIds.filter(id => id !== perm.id)
      : [...currentPermIds, perm.id];
    
    // Optimistic update local state for UI responsiveness
    setSelectedRole({ 
      ...selectedRole, 
      permissions: allPermissions.filter(p => newPermIds.includes(p.id)) 
    });
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;
    const permIds = selectedRole.permissions.map(p => p.id);
    updatePermissionsMutation.mutate({ roleId: selectedRole.id, permissions: permIds });
  };

  if (isLoadingRoles) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-bg-surface">
         <div className="h-8 w-8 border-4 border-brand-default border-t-transparent rounded-full animate-spin mb-4" />
         <p className="font-syne font-bold text-xs uppercase tracking-[0.2em] text-text-tertiary">Negotiating Identity Policies...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-7xl mx-auto py-6 px-4 sm:px-0 space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-subtle pb-6 shadow-sm bg-bg-surface/50 p-6">
        <div>
          <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand-text" /> ACCESS CONTROL MANAGER
          </h1>
          <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest mt-1">Identity & Access Governance (IAM)</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-9 text-[11px] font-bold border-border-default rounded-none px-4">
              <Activity className="h-3.5 w-3.5 mr-2" /> ACCESS LOGS
           </Button>
           <Button className="h-9 bg-brand-default hover:bg-brand-hover text-white font-bold text-[11px] px-6 shadow-brand rounded-none">
              <Plus className="h-4 w-4 mr-2" /> NEW SYSTEM ROLE
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Role List (Left Panel) */}
        <div className="lg:col-span-4 space-y-4">
           <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Organization Roles</h3>
           {roles.map((role) => (
             <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "w-full text-left p-4 border transition-all relative group",
                  selectedRole?.id === role.id 
                    ? "bg-bg-panel border-brand-default shadow-brand-inner" 
                    : "bg-bg-surface border-border-default hover:border-border-strong"
                )}
             >
                {selectedRole?.id === role.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-default" />
                )}
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-bold text-text-primary uppercase tracking-tight">{role.name}</span>
                   <Badge variant="outline" className="text-[9px] font-bold rounded-none border-border-subtle bg-bg-surface">
                      {role.userCount || 0} IDENTITIES
                   </Badge>
                </div>
                <p className="text-[10px] text-text-tertiary line-clamp-2 leading-relaxed">
                   {role.description || "No description provided for this security policy."}
                </p>
             </button>
           ))}
           <div className="p-4 bg-bg-panel/50 border border-dashed border-border-strong rounded-none">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Info className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Tip</span>
              </div>
              <p className="text-[11px] text-text-tertiary leading-relaxed italic">
                Custom roles take 15 minutes to propagate to global edge nodes after deployment.
              </p>
           </div>
        </div>

        {/* Configuration Panel (Right Panel) */}
        {!selectedRole ? (
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-20 border border-dashed border-border-default bg-bg-panel/20">
             <Shield className="h-12 w-12 text-text-tertiary mb-4 opacity-20" />
             <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Select a role to configure</p>
          </div>
        ) : (
          <div className="lg:col-span-8 space-y-6">
           <Card className="bg-bg-surface border-border-default rounded-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-default/5 blur-3xl -mr-16 -mt-16" />
              <CardHeader className="border-b border-border-subtle bg-bg-panel/30">
                 <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-syne text-xl">{selectedRole.name}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-widest text-brand-text font-bold mt-1">Configuring Active Permissions</CardDescription>
                    </div>
                    <Button 
                      onClick={handleSaveRole} 
                      disabled={updatePermissionsMutation.isPending}
                      className="bg-brand-default hover:bg-brand-hover text-white font-bold h-9 px-6 shadow-brand rounded-none text-[11px]"
                    >
                       {updatePermissionsMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                       SYNC POLICY
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-bg-panel/50 border-b border-border-subtle w-full justify-start rounded-none h-12 px-6 gap-6">
                       <TabsTrigger value="matrix" className="data-[state=active]:bg-transparent data-[state=active]:text-brand-text border-b-2 border-transparent data-[state=active]:border-brand-default rounded-none text-[10px] font-bold uppercase tracking-widest h-full">Permission Matrix</TabsTrigger>
                       <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:text-brand-text border-b-2 border-transparent data-[state=active]:border-brand-default rounded-none text-[10px] font-bold uppercase tracking-widest h-full">Assigned Identities ({selectedRole.userCount || 0})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="matrix" className="m-0">
                       <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                             <thead>
                                <tr className="bg-bg-panel/30 border-b border-border-subtle">
                                   <th className="p-4 text-left text-[9px] font-bold text-text-tertiary uppercase tracking-widest w-40">Resource Target</th>
                                   {ACTIONS.map(action => (
                                     <th key={action} className="p-4 text-center text-[9px] font-bold text-text-tertiary uppercase tracking-widest">{action}</th>
                                   ))}
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-border-subtle">
                                {RESOURCES.map(resource => (
                                  <tr key={resource} className="hover:bg-bg-surface/50 transition-colors">
                                     <td className="p-4 text-[11px] font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-brand-default" /> {resource}
                                     </td>
                                     {ACTIONS.map(action => {
                                       const isActive = selectedRole?.permissions?.some((p: Permission) => 
                                         p.resource.toLowerCase() === resource.toLowerCase() && p.action.toLowerCase() === action.toLowerCase()
                                       );
                                       return (
                                         <td key={action} className="p-4 text-center">
                                            <button 
                                              onClick={() => handleTogglePermission(resource, action)}
                                              className={cn(
                                                "h-6 w-6 border transition-all flex items-center justify-center mx-auto rounded-none",
                                                isActive 
                                                  ? "bg-brand-default border-brand-default text-white shadow-brand hover:scale-110" 
                                                  : "border-border-strong text-text-tertiary hover:border-brand-default/50"
                                              )}
                                            >
                                               {isActive ? <Check className="h-3.5 w-3.5" /> : <X className="h-3 w-3 opacity-20" />}
                                            </button>
                                         </td>
                                       );
                                     })}
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                       <div className="p-4 bg-crimson-500/5 border-t border-border-subtle flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-crimson-500" />
                          <p className="text-[10px] text-text-secondary font-medium">Changes to the permission matrix are destructive and will re-evaluate all active user sessions immediately.</p>
                       </div>
                    </TabsContent>

                    <TabsContent value="users" className="m-0 p-6 space-y-6">
                       <div className="flex justify-between items-center mb-2">
                          <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Identities assigned to this role</h4>
                          <Button variant="ghost" size="sm" className="text-[10px] font-bold text-brand-text hover:bg-brand-default/5">VIEW ALL {selectedRole.userCount || 0} USERS</Button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-bg-panel border border-border-subtle hover:border-brand-default/30 transition-all group">
                               <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-none bg-white border border-border-subtle flex items-center justify-center text-xs font-bold text-slate-800 shadow-sm group-hover:bg-slate-50">
                                     JD
                                  </div>
                                  <div>
                                     <p className="text-[12px] font-bold text-text-primary">Jan Doe {i}</p>
                                     <p className="text-[10px] text-text-tertiary">jan.doe@Vanguard.co</p>
                                  </div>
                               </div>
                               <button className="text-text-tertiary hover:text-crimson-500 transition-colors p-1">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                          ))}
                       </div>
                       <Button variant="outline" className="w-full h-10 border-dashed border-border-strong text-text-tertiary hover:text-text-primary hover:border-brand-default/50 transition-all text-xs font-bold uppercase tracking-widest">
                          + Assign More Identities
                       </Button>
                    </TabsContent>
                 </Tabs>
              </CardContent>
           </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
}
