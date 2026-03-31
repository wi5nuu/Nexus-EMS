"use client";

import { 
  User, Mail, Phone, MapPin, 
  Shield, Key, Bell, Save, Check,
  Github, Slack, Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, getUser, updateUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const user = getUser();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    officeLocation: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/v1/auth/me"),
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
    mutationFn: (data: any) => apiFetch("/api/v1/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: (newData) => {
      queryClient.setQueryData(["me"], newData);
      updateUser({
        firstName: newData.firstName,
        lastName: newData.lastName,
      });
      alert("Profile updated successfully!");
    },
  });

  const connectMutation = useMutation({
    mutationFn: (data: any) => apiFetch("/api/v1/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const handleSave = () => {
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
          className="w-full sm:w-auto h-8 bg-brand-default hover:bg-brand-hover text-white text-[11px] font-bold transition-fast shadow-brand"
        >
          {mutation.isPending ? "SAVING..." : <><Save className="h-3.5 w-3.5 mr-1.5" /> Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          <Card className="bg-bg-surface border-border-default shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/30">
               <CardTitle className="text-[9px] sm:text-[10px] font-syne font-bold uppercase tracking-widest text-text-tertiary text-center">User Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6 flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-2 border-brand-default/20 shadow-lg group-hover:opacity-80 transition-fast cursor-pointer">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.id}`} />
                  <AvatarFallback>{profile?.firstName?.[0]}{profile?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-fast pointer-events-none">
                  <div className="bg-bg-panel/80 p-1.5 rounded-full border border-border-default shadow-xl">
                    <User className="h-4 w-4 text-brand-text" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3 font-syne font-bold text-[15px] sm:text-lg text-text-primary tracking-tight text-center">{profile?.firstName} {profile?.lastName}</h3>
              <p className="text-[10px] sm:text-xs text-text-tertiary font-mono text-center truncate w-full">{profile?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <Shield className="h-2.5 w-2.5" /> Administrator
              </div>
            </CardContent>
          </Card>

         <div className="space-y-1.5">
             {[
               { icon: Bell, label: "Notification Preferences", href: "#" },
               { icon: Key, label: "Security & Passwords", href: "#" },
               { icon: MapPin, label: "Address & Location", href: "#" },
             ].map((link, i) => (
               <Button 
                key={i} 
                variant="ghost" 
                className="w-full justify-between text-[11px] sm:text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-fast h-9 px-3 group"
               >
                 <div className="flex items-center">
                    <link.icon className="h-3.5 w-3.5 mr-2.5 text-text-tertiary group-hover:text-brand-text transition-colors" />
                    {link.label}
                 </div>
                 <div className="h-1 w-1 rounded-full bg-border-strong opacity-0 group-hover:opacity-100 transition-all" />
               </Button>
             ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4 lg:space-y-6">
          <Card className="bg-bg-surface border-border-default shadow-sm overflow-hidden">
             <CardHeader className="border-b border-border-subtle bg-bg-panel/30 py-3">
               <CardTitle className="text-[9px] sm:text-[10px] font-syne font-bold uppercase tracking-widest text-text-tertiary">Personal Information</CardTitle>
             </CardHeader>
             <CardContent className="pt-4 sm:pt-6 space-y-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                   <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="h-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[11px] sm:text-[13px] focus:border-brand-default/50" 
                      />
                   </div>
                   <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="h-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[11px] sm:text-[13px] focus:border-brand-default/50" 
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <Label htmlFor="email" className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Work Email Address</Label>
                   <div className="relative group">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary group-focus-within:text-brand-text transition-colors" />
                      <Input id="email" value={profile?.email} disabled className="pl-8 h-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[11px] sm:text-[13px] opacity-60 cursor-not-allowed" />
                   </div>
                   <p className="text-[9px] sm:text-[10px] text-text-tertiary font-medium mt-1">To change your work email, please contact IT Support.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                   <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Phone Number</Label>
                      <div className="relative">
                         <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                         <Input 
                            id="phone" 
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className="pl-8 h-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[11px] sm:text-[13px] focus:border-brand-default/50" 
                          />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <Label htmlFor="location" className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Office Location</Label>
                      <div className="relative">
                         <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                         <Input 
                            id="location" 
                            value={formData.officeLocation}
                            onChange={(e) => setFormData(prev => ({ ...prev, officeLocation: e.target.value }))}
                            className="pl-8 h-9 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[11px] sm:text-[13px] focus:border-brand-default/50" 
                          />
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-bg-surface border-border-default shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-default/5 pointer-events-none" />
             <CardHeader className="relative border-b border-border-subtle bg-bg-panel/30 py-3">
               <CardTitle className="text-[9px] sm:text-[10px] font-syne font-bold uppercase tracking-widest text-text-tertiary">Connected Engineering Accounts</CardTitle>
             </CardHeader>
             <CardContent className="relative pt-4 sm:pt-6 space-y-3 pb-4">
                {[
                  { name: "GitHub", handle: profile?.employeeProfile?.githubHandle || "Not connected", connected: !!profile?.employeeProfile?.githubHandle, icon: Github, key: "githubHandle" },
                  { name: "AWS Console", handle: profile?.employeeProfile?.awsHandle || "Not connected", connected: !!profile?.employeeProfile?.awsHandle, icon: Cloud, key: "awsHandle" },
                  { name: "Slack", handle: profile?.employeeProfile?.slackHandle || "Not connected", connected: !!profile?.employeeProfile?.slackHandle, icon: Slack, key: "slackHandle" },
                ].map((account, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-bg-surface border border-border-default shadow-sm group hover:border-brand-default/30 transition-all hover:translate-x-1">
                     <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-md bg-bg-sunken border border-border-default flex items-center justify-center text-text-secondary group-hover:text-brand-text transition-all group-hover:rotate-6">
                           <account.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[11px] sm:text-[12px] font-semibold text-text-primary tracking-tight">{account.name}</p>
                           <p className={cn("text-[9px] sm:text-[10px] font-mono", account.connected ? "text-brand-text" : "text-text-tertiary")}>{account.handle}</p>
                        </div>
                     </div>
                     <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={connectMutation.isPending}
                        onClick={() => {
                          if (!account.connected) {
                            const handle = prompt(`Enter your ${account.name} handle:`);
                            if (handle) connectMutation.mutate({ [account.key]: handle });
                          } else {
                            if (confirm(`Disconnect ${account.name}?`)) connectMutation.mutate({ [account.key]: null });
                          }
                        }}
                        className={cn(
                          "h-7 text-[9px] font-bold uppercase tracking-widest transition-all",
                          account.connected 
                            ? "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 active:scale-95" 
                            : "border-border-default text-text-secondary hover:bg-bg-elevated active:scale-95"
                        )}
                     >
                        {account.connected ? <><Check className="h-3 w-3 mr-1" /> Connected</> : "Connect"}
                     </Button>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
