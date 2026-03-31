"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Send, 
  AlertTriangle, 
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/tickets");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="h-8 w-8 text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight">Create New Ticket</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-bg-surface border-border-default shadow-lg">
            <CardHeader>
              <CardTitle className="font-syne text-lg">Ticket Details</CardTitle>
              <CardDescription className="font-dmsans">Provide comprehensive information about the issue or task.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                    Ticket Title
                  </Label>
                  <Input 
                    id="title" 
                    placeholder="Brief summary of the issue..." 
                    className="h-10 bg-bg-sunken border-border-default text-text-primary font-dmsans text-[13px] focus:ring-brand-default"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                      Priority
                    </Label>
                    <select className="flex h-10 w-full rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                      Project
                    </Label>
                    <select className="flex h-10 w-full rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast">
                      <option value="NEX">Nexus Platform</option>
                      <option value="HRS">HR Portal</option>
                      <option value="INF">Infra Mod</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                    Description
                  </Label>
                  <textarea 
                    id="description" 
                    placeholder="Describe the problem, steps to reproduce, etc." 
                    rows={6}
                    className="flex w-full rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast resize-none"
                    required
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-brand-default hover:bg-brand-hover text-white font-bold px-6 shadow-brand"
                  >
                    {loading ? "Creating..." : "Create Ticket"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-bg-panel/50 border-border-subtle">
            <CardHeader>
              <CardTitle className="text-sm font-syne flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-text-tertiary space-y-4 font-dmsans">
              <p>• For production outages, use <strong>CRITICAL</strong> priority.</p>
              <p>• Include environment details (local, staging, prod).</p>
              <p>• Attach relevant log snippets where possible.</p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500">
                <AlertTriangle className="h-4 w-4 mb-2" />
                Critical tickets trigger immediate on-call notifications via PagerDuty.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bg-panel/50 border-border-subtle">
            <CardHeader>
              <CardTitle className="text-sm font-syne">Assigned Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400">
                  ENG
                </div>
                <div>
                  <p className="text-[12px] font-medium text-text-primary">Engineering Core</p>
                  <p className="text-[10px] text-text-tertiary">4 active members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
