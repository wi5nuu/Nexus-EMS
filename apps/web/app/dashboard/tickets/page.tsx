"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Ticket, Search, Plus, Loader2, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PRIORITY_STYLE: Record<string, string> = {
  CRITICAL: "bg-red-500/15 text-red-400 border-red-500/25",
  HIGH: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  LOW: "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

const STATUS_STYLE: Record<string, string> = {
  OPEN: "text-slate-400",
  TRIAGED: "text-blue-400",
  IN_PROGRESS: "text-amber-400",
  RESOLVED: "text-green-400",
  CLOSED: "text-gray-500",
};

async function fetchTickets() {
  try {
    const data = await apiFetch("/api/v1/tickets");
    if (data.data && data.data.length > 0) return data.data;
  } catch {}
  // Demo fallback
  return [
    { id: "demo-1", title: "Database CPU spiking to 100%", status: "IN_PROGRESS", priority: "CRITICAL", reporter: { email: "Wisnu@nexus.co" }, createdAt: new Date(Date.now() - 7200_000).toISOString() },
    { id: "demo-2", title: "API response time > 2s on /tasks endpoint", status: "OPEN", priority: "HIGH", reporter: { email: "sarah@nexus.co" }, createdAt: new Date(Date.now() - 86400_000).toISOString() },
    { id: "demo-3", title: "Authentication token not refreshing on mobile", status: "TRIAGED", priority: "MEDIUM", reporter: { email: "emily@nexus.co" }, createdAt: new Date(Date.now() - 172800_000).toISOString() },
    { id: "demo-4", title: "Deployment to staging failed on runner 3", status: "RESOLVED", priority: "HIGH", reporter: { email: "Wisnu@nexus.co" }, createdAt: new Date(Date.now() - 259200_000).toISOString() },
  ];
}

export default function TicketsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets-list"],
    queryFn: fetchTickets,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const filtered = tickets.filter((t: any) => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 px-4 sm:px-0"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="font-syne font-bold text-lg sm:text-xl text-text-primary tracking-tight">Support Tickets</h1>
          <p className="text-text-secondary mt-0.5 font-dmsans text-[11px] sm:text-[13px] flex items-center gap-1.5">
            {tickets.length} total tickets <span className="h-1 w-1 rounded-full bg-border-strong hidden sm:block" />
            <span className="text-crimson-500 font-medium">
              {tickets.filter((t: any) => t.priority === "CRITICAL" && t.status !== "CLOSED").length} critical
            </span>
          </p>
        </div>
        <Button 
          className="w-full sm:w-auto h-8 px-2.5 bg-brand-default hover:bg-brand-hover text-white text-[11px] font-bold transition-fast shadow-brand"
          onClick={() => router.push("/dashboard/tickets/new")}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> New Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 bg-bg-surface border-border-default text-[11px] sm:text-[13px] text-text-primary focus-visible:ring-brand-default"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
            <Button
              key={p}
              variant={priorityFilter === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPriorityFilter(p)}
              className={cn(
                "h-8 px-2.5 text-[10px] sm:text-[11px] font-medium transition-fast whitespace-nowrap",
                priorityFilter === p 
                  ? "bg-brand-default text-white hover:bg-brand-hover border-transparent" 
                  : "border-border-default text-text-secondary hover:bg-bg-elevated hover:text-text-primary bg-bg-surface"
              )}
            >
              {p === "CRITICAL" ? "CRIT" : p}
            </Button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 items-center animate-pulse">
                <div className="h-6 w-6 rounded bg-bg-elevated shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 bg-bg-elevated rounded" />
                  <div className="h-2 w-1/4 bg-bg-elevated rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-10 w-10 bg-bg-elevated rounded-full flex items-center justify-center mb-3">
              <Ticket className="w-5 h-5 text-text-tertiary" />
            </div>
            <p className="text-[13px] font-semibold text-text-primary">No tickets found</p>
            <p className="text-[11px] text-text-tertiary mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filtered.map((ticket: any) => (
              <div
                key={ticket.id}
                onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                className="flex items-center gap-3 px-3.5 sm:px-4 py-3 hover:bg-bg-elevated/50 transition-colors cursor-pointer group"
              >
                <div className="shrink-0 mt-0.5 self-start">
                  {ticket.priority === "CRITICAL" ? (
                    <AlertTriangle className="w-4 h-4 text-crimson-500" />
                  ) : (
                    <Ticket className="w-4 h-4 text-text-tertiary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-medium text-text-primary truncate group-hover:text-brand-text transition-colors">
                    {ticket.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] text-text-tertiary font-mono">
                    <span className={STATUS_STYLE[ticket.status] || "text-text-tertiary"}>
                      {ticket.status?.replace("_", " ")}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="truncate max-w-[100px]">{ticket.reporter?.email?.split("@")[0]}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "px-1.5 py-0.5 text-[9px] font-bold rounded border uppercase whitespace-nowrap hidden sm:inline-block", 
                    PRIORITY_STYLE[ticket.priority] || "bg-bg-elevated text-text-tertiary"
                  )}>
                    {ticket.priority}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

