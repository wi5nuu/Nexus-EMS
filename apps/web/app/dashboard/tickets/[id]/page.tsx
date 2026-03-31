"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Clock, AlertTriangle, MessageSquare, Tag, Loader2, Send, 
  ArrowLeft, Link2, ChevronDown, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/auth";
import { SmartTriage } from "@/components/tickets/SmartTriage";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TicketComment {
  id: string;
  body: string;
  user: { email: string };
  createdAt: string;
}

interface TicketDetail {
  id: string;
  project: { name: string; key: string };
  ticketProjectId: string;
  title: string;
  status: string;
  priority: string;
  reporter: { name: string; email: string };
  assignee: { name: string; email: string };
  description: string;
  comments: TicketComment[];
  createdAt: string;
}

async function fetchTicket(id: string): Promise<TicketDetail> {
  try {
    const data = await apiFetch<{ data: TicketDetail }>(`/api/v1/tickets/${id}`);
    if (data && data.data) return data.data;
  } catch {}
  
  return {
    id,
    project: { name: "Nexus Platform", key: "NEX" },
    ticketProjectId: "demo-proj",
    title: "Database connection spiking to 100% CPU",
    status: "IN_PROGRESS",
    priority: "CRITICAL",
    reporter: { name: "Rania Santoso", email: "rania@nexus.co" },
    assignee: { name: "Arif Kurniawan", email: "arif@nexus.co" },
    description: "The primary Postgres database is experiencing severe CPU spikes under peak load. Every 15-20 minutes, CPU jumps to 100% causing severe latency degradation.\n\n**Affected users:** 40,000+\n**Environment:** Production (us-east-1)\n**Started:** ~2 hours ago",
    comments: [
      { id: "c1", body: "I can reproduce this with pgbench at 50 concurrent connections. The issue seems to be in the query planner not using the right index.", user: { email: "arif@nexus.co" }, createdAt: new Date(Date.now() - 3600_000).toISOString() },
      { id: "c2", body: "Cross-referencing with the deployment log — this started 15min after the v2.4.0 deploy. Rolling back to v2.3.9 as a mitigation.", user: { email: "rania@nexus.co" }, createdAt: new Date(Date.now() - 1800_000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
  };
}

async function postComment(ticketId: string, body: string) {
  return apiFetch(`/api/v1/tickets/${ticketId}/comments`, { method: "POST", body: JSON.stringify({ body }) });
}

async function updateStatus(ticketId: string, status: string) {
  return apiFetch(`/api/v1/tickets/${ticketId}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

const STATUS_FLOW: Record<string, string> = {
  OPEN: "TRIAGED", TRIAGED: "IN_PROGRESS", IN_PROGRESS: "RESOLVED", RESOLVED: "CLOSED", CLOSED: "CLOSED",
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  OPEN:        { label: "Open",        color: "border-text-tertiary/30 bg-bg-elevated text-text-secondary",  dot: "bg-text-tertiary" },
  TRIAGED:     { label: "Triaged",     color: "border-sapphire-500/30 bg-sapphire-500/10 text-sapphire-400", dot: "bg-sapphire-500" },
  IN_PROGRESS: { label: "In Progress", color: "border-amber-500/30 bg-amber-500/10 text-amber-500",          dot: "bg-amber-500" },
  RESOLVED:    { label: "Resolved",    color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",    dot: "bg-emerald-500" },
  CLOSED:      { label: "Closed",      color: "border-text-tertiary/30 bg-bg-elevated text-text-tertiary",   dot: "bg-text-tertiary" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  CRITICAL: { label: "Critical", color: "border-crimson-500/30 bg-crimson-500/10 text-crimson-500" },
  HIGH:     { label: "High",     color: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  MEDIUM:   { label: "Medium",   color: "border-sapphire-500/30 bg-sapphire-500/10 text-sapphire-400" },
  LOW:      { label: "Low",      color: "border-border-default bg-bg-elevated text-text-tertiary" },
};

function SLATimer({ createdAt, priority }: { createdAt: string; priority: string }) {
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const slaHours = priority === "CRITICAL" ? 4 : priority === "HIGH" ? 8 : 24;
  const created = new Date(createdAt).getTime();
  const deadline = created + slaHours * 3600_000;
  const remaining = deadline - now;
  const totalMs = slaHours * 3600_000;
  const elapsed = now - created;
  const elapsedPct = Math.min(100, (elapsed / totalMs) * 100);

  if (remaining <= 0) {
    return (
      <div className="rounded-xl border border-crimson-500/40 bg-crimson-500/10 p-4 animate-pulse">
        <div className="flex items-center gap-2 text-crimson-500 font-bold text-sm font-dmsans">
          <AlertTriangle className="h-4 w-4" />
          SLA BREACHED
        </div>
        <p className="text-xs text-crimson-500/70 mt-1">Breach occurred {Math.abs(Math.round(remaining / 60_000))} minutes ago</p>
      </div>
    );
  }

  const h = Math.floor(remaining / 3600_000);
  const m = Math.floor((remaining % 3600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);

  const isCritical = remaining < 3600_000 * 1; // < 1h → red
  const isWarning  = remaining < 3600_000 * 2; // < 2h → amber

  const barColor = isCritical ? "bg-crimson-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";
  const textColor = isCritical ? "text-crimson-500" : isWarning ? "text-amber-500" : "text-emerald-500";
  const borderColor = isCritical ? "border-crimson-500/30 bg-crimson-500/5" : isWarning ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5";

  return (
    <div className={cn("rounded-xl border p-4", borderColor)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <Clock className="h-3.5 w-3.5" />
          SLA: {slaHours}h Policy
        </div>
        {isCritical && <span className="text-[10px] font-bold text-crimson-500 animate-pulse">BREACHING SOON</span>}
      </div>
      <p className={cn("text-2xl font-dmsans font-bold tabular-nums", textColor)}>
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </p>
      <p className="text-[11px] text-text-tertiary mb-3">remaining until breach</p>
      <div className="w-full h-1.5 bg-bg-sunken rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor, isCritical && "animate-pulse")}
          style={{ width: `${elapsedPct}%` }}
        />
      </div>
      <p className="text-[10px] text-text-tertiary mt-1.5 text-right">{Math.round(elapsedPct)}% elapsed</p>
    </div>
  );
}

export default function TicketDetail({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: ticket, isLoading } = useQuery<TicketDetail>({
    queryKey: ["ticket", params.id],
    queryFn: () => fetchTicket(params.id),
    refetchInterval: 30_000,
  });

  const commentMutation = useMutation({
    mutationFn: () => postComment(params.id, comment),
    onSuccess: () => { setComment(""); queryClient.invalidateQueries({ queryKey: ["ticket", params.id] }); },
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => updateStatus(params.id, newStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ticket", params.id] }),
  });

  if (isLoading) {
    return (
      <div className="h-full flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-64 bg-bg-elevated rounded-lg" />
        <div className="flex gap-6 flex-1">
          <div className="flex-1 bg-bg-surface rounded-xl border border-border-subtle" />
          <div className="w-72 bg-bg-surface rounded-xl border border-border-subtle" />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-text-secondary">
        <AlertTriangle className="h-8 w-8 text-text-tertiary" />
        <p className="text-sm font-medium">Ticket not found.</p>
        <Link href="/dashboard/tickets">
          <Button variant="outline" size="sm">Back to tickets</Button>
        </Link>
      </div>
    );
  }

  const nextStatus = STATUS_FLOW[ticket.status];
  const canAdvance = ticket.status !== "CLOSED";
  const statusInfo = statusConfig[ticket.status] || statusConfig.OPEN;
  const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
  const ticketId = `${ticket.project?.key || "NX"}-${params.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-120px)] overflow-hidden animate-in fade-in duration-300">
      
      {/* LEFT PANEL (65%) */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar min-w-0">
        
        {/* Ticket Header */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/dashboard/tickets" className="text-text-tertiary hover:text-text-secondary transition-fast">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-[12px] font-mono font-bold text-brand-text">{ticketId}</span>
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[11px] font-bold", priorityInfo.color)}>
              <AlertTriangle className="h-3 w-3" />
              {priorityInfo.label}
            </span>
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium", statusInfo.color)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", statusInfo.dot)} />
              {statusInfo.label}
            </span>
            <div className="ml-auto flex items-center gap-2">
              {canAdvance && (
                <Button
                  size="sm"
                  className="h-8 text-xs font-bold bg-brand-default hover:bg-brand-hover text-white"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate(nextStatus)}
                >
                  {statusMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : `→ ${nextStatus?.replace("_", " ")}`}
                </Button>
              )}
            </div>
          </div>

          <h1 className="text-xl font-syne font-bold text-text-primary leading-snug mb-4">
            {ticket.title}
          </h1>

          {ticket.description && (
            <div className="mt-3 p-4 bg-bg-sunken rounded-lg border border-border-subtle text-[13px] text-text-secondary font-dmsans leading-relaxed whitespace-pre-line">
              {ticket.description}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-subtle">
            {["database", "production", "critical-path"].map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-[11px] text-text-tertiary bg-bg-elevated px-2 py-0.5 rounded border border-border-subtle">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* SLA Banner (if critical) */}
        {ticket.priority === "CRITICAL" && (
          <SLATimer createdAt={ticket.createdAt} priority={ticket.priority} />
        )}

        {/* Activity & Comments */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-sm flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border-subtle">
            <MessageSquare className="h-4 w-4 text-brand-text" />
            <h2 className="font-syne font-bold text-sm text-text-primary">Activity & Comments</h2>
            <span className="ml-auto text-[11px] font-mono text-text-tertiary">{ticket.comments?.length || 0} comments</span>
          </div>

          <div className="space-y-4 flex-1 mb-4">
            {/* Reporter event */}
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-[10px] font-bold text-rose-400 shrink-0">
                {ticket.reporter?.name?.slice(0, 2).toUpperCase() || "RS"}
              </div>
              <div>
                <p className="text-[13px]">
                  <span className="font-semibold text-text-primary">{ticket.reporter?.name?.split(" ")[0] || "Reporter"}</span>
                  <span className="text-text-tertiary ml-1.5">created this ticket</span>
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {(ticket.comments || []).map((c: { id: string; user?: { email: string }; body: string; createdAt: string }) => (
              <div key={c.id} className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400 shrink-0">
                  {c.user?.email?.slice(0, 2).toUpperCase() || "??"}
                </div>
                <div className="flex-1 bg-bg-elevated rounded-lg border border-border-subtle p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-text-primary">{c.user?.email?.split("@")[0]}</span>
                    <span className="text-[11px] text-text-tertiary">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">{c.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="relative mt-auto">
            <textarea
              placeholder="Add a comment... (⌘Enter to submit)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && comment.trim()) {
                  commentMutation.mutate();
                }
              }}
              className="w-full bg-bg-sunken border border-border-default focus:border-brand-default focus:outline-none focus:ring-2 focus:ring-brand-muted rounded-lg p-3 pr-16 min-h-[90px] text-[13px] text-text-primary resize-none font-dmsans placeholder:text-text-tertiary transition-fast"
            />
            <Button
              size="sm"
              disabled={!comment.trim() || commentMutation.isPending}
              onClick={() => commentMutation.mutate()}
              className="absolute bottom-3 right-3 h-8 bg-brand-default hover:bg-brand-hover text-white text-xs font-bold"
            >
              {commentMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (35%) */}
      <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">

        {/* Status & Priority Controls */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm space-y-4">
          <div>
            <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">STATUS</p>
            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] font-medium justify-between cursor-pointer hover:border-border-strong transition-fast", statusInfo.color)}>
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", statusInfo.dot)} />
                {statusInfo.label}
              </div>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">PRIORITY</p>
            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] font-medium justify-between cursor-pointer hover:border-border-strong transition-fast", priorityInfo.color)}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {priorityInfo.label}
              </div>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">ASSIGNEE</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-subtle bg-bg-elevated hover:border-border-strong transition-fast cursor-pointer">
              <div className="h-6 w-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400">
                {ticket.assignee?.name?.slice(0, 2).toUpperCase() || "AK"}
              </div>
              <span className="text-[13px] font-medium text-text-primary flex-1">{ticket.assignee?.name?.split(" ")[0] || "Arif"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
            </div>
          </div>
        </div>

        {/* SLA status in right panel (summary) */}
        {ticket.priority !== "CRITICAL" && (
          <SLATimer createdAt={ticket.createdAt} priority={ticket.priority} />
        )}

        {/* Metadata */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm space-y-4">
          {[
            { label: "ENVIRONMENT", value: "Production" },
            { label: "CREATED", value: new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            { label: "REPORTER", value: ticket.reporter?.name?.split(" ")[0] || "Rania" },
            { label: "PROJECT", value: ticket.project?.name || "Nexus Platform" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-1">{label}</p>
              <p className="text-[13px] font-medium text-text-primary">{value}</p>
            </div>
          ))}

          <div>
            <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">LINKED ITEMS</p>
            <div className="space-y-1.5">
              {[{ id: "NX-488", rel: "relates to" }, { id: "PR #291", rel: "fixes" }].map((link) => (
                <div key={link.id} className="flex items-center gap-2 text-[12px] text-text-secondary hover:text-brand-text cursor-pointer transition-fast">
                  <Link2 className="h-3 w-3" />
                  <span className="font-mono font-bold">{link.id}</span>
                  <span className="text-text-tertiary">({link.rel})</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 hover:opacity-100" />
                </div>
              ))}
              <button className="flex items-center gap-1.5 text-[12px] text-text-tertiary hover:text-brand-text transition-fast mt-2">
                + Link item
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">WATCHERS (3)</p>
            <div className="flex items-center gap-1">
              {["AK", "RS", "DH"].map((w, i) => (
                <div key={i} className="h-7 w-7 rounded-full bg-violet-500/20 border border-bg-surface flex items-center justify-center text-[9px] font-bold text-violet-400 -ml-1 first:ml-0">
                  {w}
                </div>
              ))}
              <button className="ml-2 text-[12px] text-text-tertiary hover:text-brand-text transition-fast">+ Watch</button>
            </div>
          </div>
        </div>

        {/* AI Smart Triage */}
        <SmartTriage ticketId={params.id} />
      </div>
    </div>
  );
}
