"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Layers, Users, GitBranch, Clock,
  CheckCircle2, AlertCircle, MoreHorizontal,
  Settings, Target, Zap, CalendarDays, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { apiFetch } from "@/lib/auth";
import { cn } from "@/lib/utils";

async function fetchProject(id: string) {
  try {
    const data = await apiFetch(`/api/v1/projects/${id}`);
    if (data.data) return data.data;
  } catch {}

  const demos: Record<string, any> = {
    "proj-1": {
      id: "proj-1", name: "Nexus Platform v3", key: "NEX", color: "violet",
      description: "Core platform rebuild with microservices architecture and real-time event streaming via Kafka. Targets 99.99% uptime SLA.",
      status: "ACTIVE", health: "ON_TRACK", progress: 68,
      startDate: "2026-01-10", dueDate: "2026-06-30",
      members: [
        { initials: "AK", name: "Arif Kurniawan",  role: "Eng Lead",   status: "online" },
        { initials: "RS", name: "Rania Santoso",   role: "Backend",    status: "away" },
        { initials: "DH", name: "Damar Haryanto",  role: "DevOps",     status: "online" },
        { initials: "PA", name: "Putri Andriani",   role: "Frontend",   status: "offline" },
      ],
      openTickets: 14, closedTickets: 42, totalSprints: 5, currentSprint: 4,
      milestones: [
        { title: "Core API GA",       date: "Mar 2026", done: true  },
        { title: "Auth & RBAC",       date: "Apr 2026", done: true  },
        { title: "Real-time Events",  date: "May 2026", done: false },
        { title: "Production Launch", date: "Jun 2026", done: false },
      ],
    },
  };

  return (
    demos[id] || {
      id, name: "Project", key: "PRJ", color: "violet",
      description: "Project details are not available offline.",
      status: "ACTIVE", health: "ON_TRACK", progress: 50,
      startDate: "2026-01-01", dueDate: "2026-12-31",
      members: [{ initials: "AK", name: "Arif K.", role: "Lead", status: "online" }],
      openTickets: 0, closedTickets: 0, totalSprints: 1, currentSprint: 1,
      milestones: [],
    }
  );
}

const colorMap: Record<string, { border: string; bg: string; text: string; bar: string }> = {
  violet:   { border: "border-violet-500/30",   bg: "bg-violet-500/10",   text: "text-violet-400",   bar: "bg-violet-500" },
  rose:     { border: "border-rose-500/30",      bg: "bg-rose-500/10",     text: "text-rose-400",     bar: "bg-rose-500" },
  teal:     { border: "border-teal-500/30",      bg: "bg-teal-500/10",     text: "text-teal-400",     bar: "bg-teal-500" },
  sapphire: { border: "border-sapphire-500/30",  bg: "bg-sapphire-500/10", text: "text-sapphire-400", bar: "bg-sapphire-500" },
  amber:    { border: "border-amber-500/30",     bg: "bg-amber-500/10",    text: "text-amber-500",    bar: "bg-amber-500" },
  emerald:  { border: "border-emerald-500/30",   bg: "bg-emerald-500/10",  text: "text-emerald-500",  bar: "bg-emerald-500" },
};

const statusDot: Record<string, string> = {
  online: "bg-emerald-500",
  away:   "bg-amber-500",
  offline:"bg-text-tertiary",
};

const healthConfig: Record<string, { label: string; color: string }> = {
  ON_TRACK: { label: "On Track", color: "text-emerald-500" },
  AT_RISK:  { label: "At Risk",  color: "text-amber-500" },
  BLOCKED:  { label: "Blocked",  color: "text-crimson-500" },
};

const TABS = ["Overview", "Board", "Members", "Settings"] as const;
type Tab = typeof TABS[number];

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const router = useRouter();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", params.id],
    queryFn: () => fetchProject(params.id),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-bg-elevated rounded-lg" />
        <div className="h-4 w-96 bg-bg-elevated rounded" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-bg-surface rounded-xl border border-border-subtle" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-text-secondary">
        <Layers className="h-12 w-12 text-text-tertiary opacity-40" />
        <p className="text-sm font-medium">Project not found.</p>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const c = colorMap[project.color] || colorMap.violet;
  const hc = healthConfig[project.health] || healthConfig.ON_TRACK;
  const totalTickets = project.openTickets + project.closedTickets;
  const daysLeft = Math.ceil(
    (new Date(project.dueDate).getTime() - Date.now()) / 86_400_000
  );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Breadcrumb + Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <button
              onClick={() => router.push("/dashboard/projects")}
              className="text-text-tertiary hover:text-text-secondary transition-fast"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className={cn("text-[11px] font-mono font-bold px-2 py-0.5 rounded border", c.border, c.bg, c.text)}>
              {project.key}
            </span>
            <span className="text-[11px] text-text-tertiary">/ {project.name}</span>
          </div>
          <h1 className="font-syne font-bold text-lg sm:text-xl text-text-primary tracking-tight">
            {project.name}
          </h1>
          <p className="text-[11px] sm:text-[13px] text-text-secondary font-dmsans mt-0.5 max-w-lg leading-snug">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-8 border-border-default text-text-secondary hover:bg-bg-elevated text-xs font-medium">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Share
          </Button>
          <Button size="sm" className="h-8 bg-brand-default hover:bg-brand-hover text-white text-xs font-bold shadow-brand">
            <Settings className="h-3.5 w-3.5 mr-1.5" /> Settings
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[
          {
            label: "PROGRESS",
            value: `${project.progress || 0}%`,
            icon: Target,
            sub: <span className={hc.color}>{hc.label}</span>,
          },
          {
            label: "OPEN TICKETS",
            value: project.openTickets || 0,
            icon: AlertCircle,
            sub: <span className="text-text-tertiary">{totalTickets} total</span>,
          },
          {
            label: "SPRINT",
            value: `${project.currentSprint || 1} / ${project.totalSprints || 1}`,
            icon: Zap,
            sub: <span className="text-text-tertiary">Current sprint</span>,
          },
          {
            label: "DEADLINE",
            value: daysLeft > 0 ? `${daysLeft}d` : "No deadline",
            icon: CalendarDays,
            sub: <span className="text-text-tertiary">{project.dueDate ? new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}</span>,
          },
        ].map((item) => (
          <div key={item.label} className="bg-bg-surface border border-border-subtle rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary">{item.label}</p>
              <item.icon className={cn("h-3.5 w-3.5", c.text)} />
            </div>
            <p className="font-dmsans font-bold text-lg text-text-primary">{item.value}</p>
            <div className="text-[10px] sm:text-[11px] font-dmsans mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-0 border-b border-border-subtle overflow-x-auto custom-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-2 text-[11px] sm:text-[13px] font-medium font-dmsans border-b-2 -mb-px transition-fast whitespace-nowrap",
              activeTab === tab
                ? "border-brand-default text-brand-text"
                : "border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-default"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Progress Bar + Milestones */}
          <div className="lg:col-span-7 space-y-3">
            {/* Overall progress */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-syne font-bold text-[13px] text-text-primary">Overall Progress</h3>
                <span className={cn("font-dmsans font-bold text-[13px]", c.text)}>{project.progress}%</span>
              </div>
              <div className="h-2.5 w-full bg-bg-sunken rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", c.bar)}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-text-tertiary font-dmsans">
                <span>Started {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span>Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>

            {/* Milestones */}
            {project.milestones?.length > 0 && (
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
                <h3 className="font-syne font-bold text-[13px] text-text-primary mb-3">Milestones</h3>
                <div className="space-y-2.5">
                  {project.milestones.map((ms: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center shrink-0 border",
                        ms.done
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                          : "bg-bg-elevated border-border-default text-text-tertiary"
                      )}>
                        {ms.done
                          ? <CheckCircle2 className="h-3.5 w-3.5" />
                          : <span className="text-[10px] font-mono font-bold">{i + 1}</span>
                        }
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-[13px] font-medium", ms.done ? "line-through text-text-tertiary" : "text-text-primary")}>
                          {ms.title}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-text-tertiary">{ms.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Summary */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
              <h3 className="font-syne font-bold text-[13px] text-text-primary mb-3">Ticket Summary</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Open",     value: project.openTickets,   color: "text-crimson-500", bg: "bg-crimson-500/10" },
                  { label: "Closed",   value: project.closedTickets, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Total",    value: totalTickets,          color: "text-text-primary", bg: "bg-bg-elevated" },
                ].map((s) => (
                  <div key={s.label} className={cn("rounded-lg p-3 text-center", s.bg)}>
                    <p className={cn("font-dmsans font-bold text-2xl", s.color)}>{s.value}</p>
                    <p className="text-[11px] font-dmsans text-text-tertiary mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => router.push("/dashboard/tickets")}
                variant="outline"
                size="sm"
                className="w-full mt-4 text-xs border-border-default text-text-secondary hover:bg-bg-elevated"
              >
                View all tickets
              </Button>
            </div>
          </div>

          {/* Right Panel — Team */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-syne font-bold text-[13px] text-text-primary">Team Members</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] px-2 text-brand-text hover:text-brand-hover"
                >
                  <Users className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {project.members?.map((m: any, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 group">
                    <div className="relative shrink-0">
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold border",
                        c.bg, c.text, c.border
                      )}>
                        {m.initials}
                      </div>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-surface",
                        statusDot[m.status] || statusDot.offline
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary truncate">{m.name}</p>
                      <p className="text-[11px] text-text-tertiary">{m.role}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium capitalize hidden group-hover:inline",
                      m.status === "online" ? "text-emerald-500" : m.status === "away" ? "text-amber-500" : "text-text-tertiary"
                    )}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-sm">
              <h3 className="font-syne font-bold text-sm text-text-primary mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setActiveTab("Board")}
                  className="w-full h-9 bg-brand-default hover:bg-brand-hover text-white text-xs font-bold transition-fast justify-start"
                >
                  <GitBranch className="h-3.5 w-3.5 mr-2" /> Open Sprint Board
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/tickets")}
                  variant="outline"
                  size="sm"
                  className="w-full h-9 text-xs border-border-default text-text-secondary hover:bg-bg-elevated justify-start"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-2" /> View Issue Tracker
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/analytics")}
                  variant="outline"
                  size="sm"
                  className="w-full h-9 text-xs border-border-default text-text-secondary hover:bg-bg-elevated justify-start"
                >
                  <Target className="h-3.5 w-3.5 mr-2" /> Analytics Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Board" && (
        <div className="h-[calc(100vh-260px)]">
          <KanbanBoard />
        </div>
      )}

      {activeTab === "Members" && (
        <div className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <div>
              <h3 className="font-syne font-bold text-[13px] text-text-primary">Project Members</h3>
              <p className="text-[10px] text-text-tertiary mt-0.5">{project.members?.length || 0} members on this project</p>
            </div>
            <Button size="sm" className="h-8 bg-brand-default hover:bg-brand-hover text-white text-xs font-bold">
              <Users className="h-3.5 w-3.5 mr-1.5" /> Add Member
            </Button>
          </div>
          <div className="divide-y divide-border-subtle">
            {project.members?.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated transition-fast group">
                <div className="relative shrink-0">
                  <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-bold border", c.bg, c.text, c.border)}>
                    {m.initials}
                  </div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-surface", statusDot[m.status])} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-text-primary">{m.name}</p>
                  <p className="text-[11px] text-text-tertiary">{m.role}</p>
                </div>
                <span className={cn(
                  "text-[11px] font-medium capitalize bg-bg-elevated px-2 py-0.5 rounded border border-border-subtle",
                  m.status === "online" ? "text-emerald-500" : m.status === "away" ? "text-amber-500" : "text-text-tertiary"
                )}>
                  {m.status}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-text-tertiary opacity-0 group-hover:opacity-100 transition-fast">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Settings" && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-syne font-bold text-sm text-text-primary">General</h3>
            <div className="space-y-3">
              {[
                { label: "Project Name",  value: project.name },
                { label: "Project Key",   value: project.key },
                { label: "Status",        value: project.status },
                { label: "Start Date",    value: new Date(project.startDate).toLocaleDateString() },
                { label: "Due Date",      value: new Date(project.dueDate).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <span className="text-[12px] font-mono font-bold uppercase tracking-widest text-text-tertiary">{label}</span>
                  <span className="text-[13px] font-medium text-text-primary">{value}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="text-xs border-border-default text-text-secondary hover:bg-bg-elevated">
              Edit Settings
            </Button>
          </div>
          <div className="bg-crimson-500/5 border border-crimson-500/20 rounded-xl p-5">
            <h3 className="font-syne font-bold text-sm text-crimson-500 mb-2">Danger Zone</h3>
            <p className="text-[12px] font-dmsans text-text-secondary mb-4">
              Archiving or deleting a project is permanent. All associated tickets and data will be affected.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs border-crimson-500/30 text-crimson-500 hover:bg-crimson-500/10">
                Archive Project
              </Button>
              <Button variant="outline" size="sm" className="text-xs border-crimson-500/30 text-crimson-500 hover:bg-crimson-500/10">
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
