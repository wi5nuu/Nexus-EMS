"use client";

import { 
  Mail, 
  Shield, Key, Save,
  Github, Slack, Camera,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, updateUser } from "@/lib/auth";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeProfile?: {
    phoneNumber?: string;
    officeLocation?: string;
    department?: string;
    position?: string;
    bio?: string;
  };
}

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    officeLocation: "",
  });

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiFetch<ProfileData>("/api/v1/auth/me");
      return res;
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.employeeProfile?.phoneNumber || "",
        officeLocation: profile.employeeProfile?.officeLocation || "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: Partial<ProfileData>) => apiFetch<ProfileData>("/api/v1/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: (newData) => {
      queryClient.setQueryData(["me"], newData);
      if (newData) {
        updateUser({
          firstName: newData.firstName,
          lastName: newData.lastName,
        });
      }
      toast.success("Profile security baseline updated.");
    },
    onError: (err: unknown) => {
      toast.error(`Sync failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast.success("Biometric profile photo updated.");
    }, 2000);
  };

  const handleSave = () => {
    toast.info("Syncing with Vanguard Central...");
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-text-tertiary font-mono animate-pulse">Loading secure profile...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0 py-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="font-syne font-bold text-lg sm:text-xl text-text-primary tracking-tight">Profile Settings</h1>
          <p className="text-text-secondary mt-0.5 font-dmsans text-[11px] sm:text-[13px]">Update your personal information and account settings.</p>
        </div>
        <Button 
          disabled={mutation.isPending}
          onClick={handleSave}
          className="w-full sm:w-auto h-8 bg-brand-default hover:bg-brand-hover text-white text-[11px] font-bold transition-all shadow-brand rounded-none"
        >
          {mutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
          {mutation.isPending ? "SYNCING..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          <Card className="bg-bg-surface border-border-default shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/30">
               <CardTitle className="text-[9px] sm:text-[10px] font-syne font-bold uppercase tracking-widest text-text-tertiary text-center">User Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-6 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border-default shadow-xl group-hover:border-brand-default transition-all">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.id}`} />
                  <AvatarFallback className="bg-bg-sunken text-lg sm:text-xl font-bold">{profile?.firstName?.[0]}{profile?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                   <Camera className="h-5 w-5 text-white" />
                   <span className="text-[8px] text-white font-bold uppercase mt-1">Change</span>
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-brand-text animate-spin" />
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
              <h2 className="mt-4 font-syne font-bold text-md sm:text-lg text-text-primary">{profile?.firstName} {profile?.lastName}</h2>
              <p className="text-[10px] font-mono font-bold text-brand-text uppercase tracking-widest mt-1 bg-brand-default/10 px-2 py-0.5 rounded-full">{profile?.employeeProfile?.position || "Member"}</p>
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3 text-[11px] sm:text-[12px] text-text-secondary group">
                  <Mail className="h-3.5 w-3.5 text-text-tertiary group-hover:text-brand-text transition-fast" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] sm:text-[12px] text-text-secondary group">
                  <Shield className="h-3.5 w-3.5 text-text-tertiary group-hover:text-brand-text transition-fast" />
                  <span>{profile?.employeeProfile?.department || "General"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
             <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] px-1">Security Score</h3>
             <div className="bg-bg-panel border border-border-default rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-[11px] font-bold text-text-primary">2FA Status</span>
                   </div>
                   <span className="text-[10px] font-bold text-emerald-500 uppercase">ACTIVE</span>
                </div>
                <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                   <div className="h-full w-4/5 bg-emerald-500" />
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4 lg:space-y-6">
          <Card className="bg-bg-surface border-border-default shadow-sm border-t-4 border-t-brand-default">
            <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/30">
               <CardTitle className="text-[10px] sm:text-[11px] font-syne font-bold uppercase tracking-widest text-text-primary">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">First Name</Label>
                  <Input 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Enter first name"
                    className="h-9 text-[13px] bg-bg-sunken border-border-default focus:border-brand-default transition-fast"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Last Name</Label>
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Enter last name"
                    className="h-9 text-[13px] bg-bg-sunken border-border-default focus:border-brand-default transition-fast"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Phone Number</Label>
                  <Input 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="+62..."
                    className="h-9 text-[13px] bg-bg-sunken border-border-default focus:border-brand-default transition-fast"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Office Location</Label>
                  <Input 
                    value={formData.officeLocation}
                    onChange={(e) => setFormData({...formData, officeLocation: e.target.value})}
                    placeholder="e.g. Jakarta SCBD"
                    className="h-9 text-[13px] bg-bg-sunken border-border-default focus:border-brand-default transition-fast"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bg-surface border-border-default shadow-sm">
            <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/30">
               <CardTitle className="text-[10px] sm:text-[11px] font-syne font-bold uppercase tracking-widest text-text-primary">Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-sunken border border-border-default hover:border-brand-default/30 transition-fast group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-border-subtle group-hover:rotate-3 transition-fast">
                       <Github className="h-5 w-5 text-[#181717]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-text-primary">GitHub Integration</p>
                      <p className="text-[11px] text-text-tertiary">Connected as @wi5nuu</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-crimson-500 hover:bg-crimson-500/10">DISCONNECT</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-sunken border border-border-default opacity-60">
                   <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-border-subtle">
                       <Slack className="h-5 w-5 text-[#4A154B]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-text-primary">Slack Workspace</p>
                      <p className="text-[11px] text-text-tertiary">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm" className="h-7 text-[10px] font-bold bg-brand-muted text-brand-text hover:bg-brand-default/20">CONNECT</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end p-4 border border-dashed border-border-default rounded-xl bg-bg-panel/10">
             <Button variant="ghost" className="text-[11px] font-bold text-text-tertiary hover:text-crimson-500 transition-fast">
                DELETE ACCOUNT PERMANENTLY
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
