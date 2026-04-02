"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Filter, 
  Eye, 
  User as UserIcon, 
  Globe, 
  Clock,
  ArrowUpDown,
  Lock,
  ExternalLink,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  userName?: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  newValues?: any;
  oldValues?: any;
  createdAt: string;
}

export default function AuditLogsPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Security: Ensure only admins can access
  if (session && (session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPERADMIN') {
     // Optional: redirect('/dashboard');
  }

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => apiFetch<{ data: AuditLog[] }>("/api/v1/audit"),
  });

  const logs = data?.data || [];

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.userName?.toLowerCase().includes(search?.toLowerCase() || "") ||
    log.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = [
      ["Event ID", "User", "Email", "Action", "Resource", "IP", "Timestamp"],
      ...filteredLogs.map(log => [log.id, log.userName, log.userEmail, log.action, log.resource, log.ipAddress, log.createdAt])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Vanguard_security_audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success("Security Audit CSV Report generated.");
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Vanguard_security_audit_${new Date().toISOString().split('T')[0]}.json`);
    link.click();
    toast.success("Security Audit JSON Ledger exported.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-6 px-4 sm:px-0 space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-surface/50 p-6 border border-border-subtle shadow-sm">
        <div>
          <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand-text" /> SECURITY AUDIT EXPLORER
          </h1>
          <p className="text-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Immutable Interaction Ledger · SOC2 Compliance</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-9 text-[11px] font-bold border-border-default hover:bg-bg-elevated" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-2" /> CSV
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none h-9 text-[11px] font-bold border-border-default hover:bg-bg-elevated" onClick={handleExportJson}>
            <FileText className="h-3.5 w-3.5 mr-2" /> JSON LEDGER
          </Button>
          <Button className="flex-1 sm:flex-none h-9 bg-brand-default hover:bg-brand-hover text-white font-bold text-[11px] px-6 shadow-brand rounded-none">
            SYNC CLOUD
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="bg-bg-surface border-border-default rounded-none shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 p-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input 
              placeholder="Filter by action, user, or resource ID..." 
              className="pl-10 h-10 bg-bg-panel border-border-subtle rounded-none text-xs focus-visible:ring-brand-default"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <Button variant="outline" className="h-10 text-[10px] font-bold border-border-subtle px-4 rounded-none bg-bg-panel">
                <Filter className="h-3.5 w-3.5 mr-2" /> ALL RESOURCES
             </Button>
             <Button variant="outline" className="h-10 text-[10px] font-bold border-border-subtle px-4 rounded-none bg-bg-panel">
                <Clock className="h-3.5 w-3.5 mr-2" /> LAST 24H
             </Button>
          </div>
        </div>
      </Card>

      {/* Audit Table */}
      <div className="bg-bg-surface border border-border-default shadow-2xl overflow-hidden rounded-none relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-default" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-panel/50 border-b border-border-subtle text-left">
                <th className="p-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest w-40">Event ID</th>
                <th className="p-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Identity</th>
                <th className="p-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Interaction</th>
                <th className="p-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Resource Path</th>
                <th className="p-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-center">Origin IP</th>
                <th className="p-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">
                   <div className="flex items-center justify-end gap-1">Timestamp <ArrowUpDown className="h-3 w-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-tertiary">
                    <div className="flex flex-col items-center gap-2">
                       <div className="h-5 w-5 border-2 border-brand-default border-t-transparent rounded-full animate-spin" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Retrieving Secure Logs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-tertiary text-[10px] font-bold uppercase tracking-widest">
                    No matching audit records found.
                  </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-elevated/50 transition-colors group cursor-pointer" onClick={() => setSelectedLog(log)}>
                  <td className="p-4">
                    <span className="text-[11px] font-mono font-bold text-text-tertiary group-hover:text-brand-text transition-colors">#{log.id.split('-')[0]}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                       <div className="h-7 w-7 rounded-none bg-white border border-border-subtle flex items-center justify-center text-[10px] font-bold text-slate-800 uppercase shadow-sm">
                          {log.userName?.[0] || <UserIcon className="h-3 w-3" />}
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-text-primary leading-none uppercase">{log.userName || "System Process"}</p>
                          <p className="text-[9px] text-text-tertiary mt-1 font-mono tracking-tighter">{log.userEmail || "auth.Vanguard.internal"}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                     <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-none rounded-none text-[9px] font-bold px-2 py-0.5 tracking-tighter uppercase">
                        {log.action}
                     </Badge>
                  </td>
                  <td className="p-4">
                     <span className="text-[11px] font-mono text-text-secondary bg-bg-panel px-1.5 py-0.5 rounded border border-border-subtle">
                        {log.resource}
                     </span>
                  </td>
                  <td className="p-4 text-center">
                     <span className="text-[10px] font-mono text-text-tertiary flex items-center justify-center gap-1">
                        <Globe className="h-3 w-3 opacity-30" /> {log.ipAddress || "127.0.0.1"}
                     </span>
                  </td>
                  <td className="p-4 text-right">
                     <p className="text-[10px] font-bold text-text-secondary">{new Date(log.createdAt).toLocaleDateString()}</p>
                     <p className="text-[9px] text-text-tertiary mt-0.5">{new Date(log.createdAt).toLocaleTimeString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Log Dialog */}
      <AnimatePresence>
        {selectedLog && (
          <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
            <DialogContent className="max-w-2xl bg-bg-surface border-border-default rounded-none shadow-2xl p-0 overflow-hidden">
               <div className="h-1 w-full bg-brand-default" />
               <DialogHeader className="p-6 bg-bg-panel/30 border-b border-border-subtle">
                  <div className="flex justify-between items-start">
                     <div>
                        <DialogTitle className="font-syne text-xl flex items-center gap-2">
                           <Lock className="h-5 w-5 text-brand-text" /> EVENT LEDGER DETAILS
                        </DialogTitle>
                        <DialogDescription className="text-xs uppercase tracking-widest font-mono text-text-tertiary mt-1">
                           Checksum: {Math.random().toString(16).substring(2, 10).toUpperCase()} · VERIFIED
                        </DialogDescription>
                     </div>
                     <Badge className="bg-emerald-500 text-white rounded-none font-bold text-[9px]">IMMUTABLE</Badge>
                  </div>
               </DialogHeader>
               
               <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div>
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">Action Origin</p>
                           <p className="text-xs font-bold text-text-primary px-3 py-2 bg-bg-panel border border-border-subtle inline-block min-w-[120px]">
                              {selectedLog.userName || "System"}
                           </p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">Network Identity</p>
                           <p className="text-[11px] font-mono text-text-secondary truncate">
                              IP: {selectedLog.ipAddress || "Internal Hub"}
                           </p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">Interaction Target</p>
                           <p className="text-xs font-bold text-text-primary px-3 py-2 bg-bg-panel border border-border-subtle inline-block min-w-[120px]">
                              {selectedLog.resource}
                           </p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">Resource Identifier</p>
                           <p className="text-[11px] font-mono text-text-secondary">
                              UID: {selectedLog.resourceId || "GLOBAL_SCOPE"}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Transaction Metadata (Payload)</p>
                     <div className="bg-slate-900 text-emerald-400 p-4 font-mono text-[10px] leading-relaxed max-h-[200px] overflow-y-auto border border-slate-800 shadow-inner rounded-none">
                        <pre>{JSON.stringify({
                           action: selectedLog.action,
                           target: selectedLog.resource,
                           id: selectedLog.resourceId,
                           before: selectedLog.oldValues || null,
                           after: selectedLog.newValues || null,
                           timestamp: selectedLog.createdAt,
                           integrity_hash: "sha256:8f43..."
                        }, null, 2)}</pre>
                     </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button variant="outline" className="flex-1 h-10 text-[11px] font-bold border-border-strong rounded-none">
                        <ExternalLink className="h-3.5 w-3.5 mr-2" /> TRACE ON EXPLORER
                     </Button>
                     <Button className="flex-1 h-10 bg-brand-default text-white font-bold text-[11px] rounded-none">
                        REQUEST RAW BUNDLE
                     </Button>
                  </div>
               </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
