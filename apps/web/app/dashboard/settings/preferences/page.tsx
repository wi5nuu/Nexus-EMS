"use client";

import { useState } from "react";
import { 
  Moon, Sun, Monitor, 
  Bell, Mail, MessageSquare, 
  Layout, Sidebar, Maximize,
  Save, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PreferencesPage() {
  const [theme, setTheme] = useState("SYSTEM");
  const [density, setDensity] = useState("DEFAULT");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Workspace preferences synchronized.");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-8 py-6 px-4 sm:px-0"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight uppercase">User Preferences</h1>
          <p className="text-text-secondary mt-1 font-dmsans text-sm font-medium">Tailor your Vanguard Hub experience to your workflow.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto bg-brand-default hover:bg-brand-hover text-white font-bold px-8 shadow-brand rounded-none h-10 transition-all active:scale-95"
        >
          {saving ? "SYNCING..." : <><Save className="h-4 w-4 mr-2" /> Save Preferences</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Appearance Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <Layout className="h-4 w-4 text-brand-text" />
             <h2 className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Visual Interface</h2>
          </div>
          
          <Card className="bg-bg-surface border-border-default overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="font-syne text-lg">Theme Engine</CardTitle>
              <CardDescription className="text-xs">Select your preferred interface aesthetic.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              {[
                { id: "LIGHT", icon: Sun, label: "Light" },
                { id: "DARK", icon: Moon, label: "Dark" },
                { id: "SYSTEM", icon: Monitor, label: "Auto" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 border rounded-none transition-all group",
                    theme === t.id 
                      ? "bg-brand-default/10 border-brand-default text-brand-text" 
                      : "bg-bg-panel border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-secondary"
                  )}
                >
                  <t.icon className={cn("h-5 w-5", theme === t.id ? "animate-pulse" : "")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-bg-surface border-border-default overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="font-syne text-lg">Sidebar Density</CardTitle>
              <CardDescription className="text-xs">Adjust the information density of your navigation.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
               {[
                 { id: "DEFAULT", icon: Sidebar, label: "Comfortable" },
                 { id: "COMPACT", icon: Maximize, label: "High Density" },
               ].map((d) => (
                 <button
                   key={d.id}
                   onClick={() => setDensity(d.id)}
                   className={cn(
                     "flex items-center gap-3 p-4 border rounded-none transition-all text-left group",
                     density === d.id 
                       ? "bg-brand-default/10 border-brand-default text-brand-text" 
                       : "bg-bg-panel border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-secondary"
                   )}
                 >
                   <d.icon className="h-5 w-5 shrink-0" />
                   <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{d.label}</span>
                 </button>
               ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <Bell className="h-4 w-4 text-brand-text" />
             <h2 className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Notification System</h2>
          </div>

          <Card className="bg-bg-surface border-border-default">
            <CardHeader>
              <CardTitle className="font-syne text-lg">Channels</CardTitle>
              <CardDescription className="text-xs">Choose where you want to receive system alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Email Reports", desc: "Weekly project summaries and payroll alerts.", icon: Mail },
                { title: "Dashboard Toasts", desc: "Real-time interactive notifications in-app.", icon: Bell },
                { title: "Slack Webhooks", desc: "Critical engineering incidents and deployments.", icon: MessageSquare },
              ].map((chan, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-bg-panel border border-border-subtle hover:border-brand-default/30 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="p-2 rounded-none bg-bg-surface border border-border-subtle text-text-tertiary group-hover:text-brand-text transition-all">
                        <chan.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-text-primary">{chan.title}</p>
                        <p className="text-[11px] text-text-tertiary">{chan.desc}</p>
                      </div>
                   </div>
                   <div className="h-5 w-10 bg-emerald-500/20 border border-emerald-500/30 rounded-full relative cursor-pointer group-hover:bg-emerald-500/30 transition-all">
                      <div className="absolute right-1 top-1 h-3 w-3 bg-emerald-500 rounded-full" />
                   </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-6 border border-dashed border-border-default rounded-none bg-bg-panel/20 relative overflow-hidden">
             <div className="flex items-center gap-3 text-emerald-500 mb-3">
               <CheckCircle2 className="h-4 w-4" />
               <span className="text-[11px] font-bold uppercase tracking-widest font-syne">All systems synced</span>
             </div>
             <p className="text-xs text-text-tertiary leading-relaxed font-medium">
               Your preferences are stored in the Vanguard Cloud and will be applies across all your authorized devices and active CLI sessions.
             </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
