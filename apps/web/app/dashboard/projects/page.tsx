"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Layers, Plus, Search, MoreHorizontal,
  CheckCircle2, AlertCircle, LayoutGrid, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/MetricCard";

interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  status: string;
  health: "ON_TRACK" | "AT_RISK" | "BLOCKED";
  progress: number;
  startDate: string;
  dueDate: string;
  members: string[];
  openTickets: number;
  closedTickets: number;
  color: string;
}

async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await apiFetch<{ data: Project[] }>("/api/v1/projects");
    if (data?.data && data.data.length > 0) return data.data;
  } catch {}
  return [
    {
      id: "proj-1",
      name: "Nexus Platform v3",
      key: "NEX",
      description: "Core platform rebuild with microservices architecture and real-time event streaming.",
      status: "ACTIVE",
      health: "ON_TRACK",
      progress: 68,
      startDate: "2026-01-10",
      dueDate: "2026-06-30",
      members: ["AK", "RS", "DH", "PA"],
      openTickets: 14,
      closedTickets: 42,
      color: "violet",
    },
    {
      id: "proj-2",
      name: "HR Self-Service Portal",
      key: "HRS",
      description: "Employee self-service portal for leave, attendance, payroll and performance management.",
      status: "ACTIVE",
      health: "AT_RISK",
      progress: 42,
      startDate: "2026-02-01",
      dueDate: "2026-07-15",
      members: ["SW", "BM"],
      openTickets: 9,
      closedTickets: 18,
      color: "rose",
    },
    {
      id: "proj-3",
      name: "Infra Modernization",
      key: "INF",
      description: "Migrate legacy services to Kubernetes with automated CI/CD pipelines and observability.",
      status: "ACTIVE",
      health: "ON_TRACK",
      progress: 85,
      startDate: "2025-11-01",
      dueDate: "2026-04-30",
      members: ["DH", "BM", "AK"],
      openTickets: 3,
      closedTickets: 67,
      color: "teal",
    },
    {
      id: "proj-4",
      name: "Analytics Dashboard",
      key: "ANL",
      description: "Real-time business intelligence dashboard with interactive charts and custom reporting.",
      status: "ON_HOLD",
      health: "BLOCKED",
      progress: 24,
      startDate: "2026-03-01",
      dueDate: "2026-09-01",
      members: ["PA", "RS"],
      openTickets: 5,
      closedTickets: 6,
      color: "sapphire",
    },
    {
      id: "proj-5",
      name: "Mobile App (iOS/Android)",
      key: "MOB",
      description: "Cross-platform React Native mobile application for field engineers.",
      status: "PLANNING",
      health: "ON_TRACK",
      progress: 8,
      startDate: "2026-04-01",
      dueDate: "2026-12-31",
      members: ["PA"],
      openTickets: 2,
      closedTickets: 1,
      color: "amber",
    },
    {
      id: "proj-6",
      name: "Security Hardening",
      key: "SEC",
      description: "SOC2 Type II compliance, penetration testing remediation, and zero-trust network.",
      status: "ACTIVE",
      health: "ON_TRACK",
      progress: 91,
      startDate: "2025-10-01",
      dueDate: "2026-04-15",
      members: ["AK", "DH"],
      openTickets: 1,
      closedTickets: 38,
      color: "emerald",
    },
  ];
}

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  violet:  { border: "border-violet-500/30",  bg: "bg-violet-500/10",  text: "text-violet-400",  dot: "bg-violet-500" },
  rose:    { border: "border-rose-500/30",     bg: "bg-rose-500/10",     text: "text-rose-400",    dot: "bg-rose-500" },
  teal:    { border: "border-teal-500/30",     bg: "bg-teal-500/10",     text: "text-teal-400",    dot: "bg-teal-500" },
  sapphire:{ border: "border-sapphire-500/30", bg: "bg-sapphire-500/10", text: "text-sapphire-400",dot: "bg-sapphire-500" },
  amber:   { border: "border-amber-500/30",    bg: "bg-amber-500/10",    text: "text-amber-500",   dot: "bg-amber-500" },
  emerald: { border: "border-emerald-500/30",  bg: "bg-emerald-500/10",  text: "text-emerald-500", dot: "bg-emerald-500" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE:   { label: "Active",    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
  ON_HOLD:  { label: "On Hold",   color: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
  PLANNING: { label: "Planning",  color: "bg-sapphire-500/10 text-sapphire-400 border-sapphire-500/30" },
  DONE:     { label: "Completed", color: "bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30" },
};

const healthConfig: Record<string, { label: string; color: string }> = {
  ON_TRACK: { label: "On Track", color: "text-emerald-500" },
  AT_RISK:  { label: "At Risk",  color: "text-amber-500" },
  BLOCKED:  { label: "Blocked",  color: "text-crimson-500" },
};

export default function ProjectsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects-list"],
    queryFn: fetchProjects,
    staleTime: 30_000,
  });

  const filtered = projects.filter((p: Project) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.key.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount   = projects.filter((p: Project) => p.status === "ACTIVE").length;
  const atRiskCount   = projects.filter((p: Project) => p.health === "AT_RISK" || p.health === "BLOCKED").length;
  const avgProgress   = projects.length
    ? Math.round(projects.reduce((s: number, p: Project) => s + (p.progress || 0), 0) / projects.length)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 sm:space-y-5 px-4 sm:px-0 py-4 sm:py-6"
    >

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="font-syne font-bold text-lg sm:text-xl text-text-primary tracking-tight">Projects</h1>
          <p className="text-text-secondary mt-0.5 font-dmsans text-[11px] sm:text-[13px]">
            {isLoading ? "Loading..." : `${projects.length} projects · ${activeCount} active`}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="hidden sm:flex bg-bg-sunken border border-border-default rounded-md p-0.5">
            <Button variant="ghost" size="icon" className="h-7 w-7 bg-bg-surface shadow-sm text-brand-text">
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-text-tertiary hover:text-text-secondary">
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button className="flex-1 sm:flex-none h-8 px-2.5 bg-brand-default hover:bg-brand-hover text-white text-[11px] font-bold transition-fast shadow-brand">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="TOTAL PROJECTS" value={isLoading ? "—" : projects.length} trend={2} trendDirection="higher-is-better" status="normal" progress={100} />
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="ACTIVE" value={isLoading ? "—" : activeCount} trend={0} trendDirection="higher-is-better" status="success" progress={Math.round((activeCount / Math.max(projects.length, 1)) * 100)} />
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="AT RISK" value={isLoading ? "—" : atRiskCount} trend={-1} trendDirection="lower-is-better" status={atRiskCount > 0 ? "warning" : "success"} progress={Math.round((atRiskCount / Math.max(projects.length, 1)) * 100)} />
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="AVG PROGRESS" value={isLoading ? "—" : avgProgress} unit="%" trend={3.2} trendDirection="higher-is-better" status="normal" progress={avgProgress} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 bg-bg-sunken border-border-default text-text-primary placeholder:text-text-tertiary font-dmsans text-[11px] sm:text-[13px] focus-visible:ring-brand-default focus:border-brand-default focus:ring-2 focus:ring-brand-muted focus:ring-offset-0 transition-fast"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {["ALL", "ACTIVE", "PLANNING", "ON_HOLD"].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "h-8 px-2.5 text-[10px] sm:text-[11px] whitespace-nowrap font-medium transition-fast",
                statusFilter === s
                  ? "bg-brand-default text-white border-transparent"
                  : "border-border-default text-text-secondary hover:bg-bg-elevated hover:text-text-primary bg-bg-surface"
              )}
            >
              {s === "ON_HOLD" ? "On Hold" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-bg-surface border border-border-subtle rounded-xl p-4 h-44 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary">
          <Layers className="h-10 w-10 text-text-tertiary opacity-40" />
          <p className="text-[13px] font-medium">No projects found</p>
          {search && (
            <button onClick={() => setSearch("")} className="text-[11px] text-brand-text hover:text-brand-hover font-medium transition-fast">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((project: Project) => {
            const c = colorMap[project.color] || colorMap.violet;
            const sc = statusConfig[project.status] || statusConfig.ACTIVE;
            const hc = healthConfig[project.health] || healthConfig.ON_TRACK;

            return (
              <div
                key={project.id}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="group bg-bg-surface border border-border-subtle hover:border-brand-default/40 rounded-xl p-4 shadow-sm cursor-pointer transition-all duration-150 flex flex-col gap-3.5"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("h-9 w-9 rounded-lg border flex items-center justify-center shrink-0", c.border, c.bg)}>
                      <span className={cn("text-[11px] font-mono font-bold", c.text)}>{project.key}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-syne font-bold text-[14px] text-text-primary truncate group-hover:text-brand-text transition-fast">
                        {project.name}
                      </h3>
                      <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border", sc.color)}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {sc.label}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 shrink-0 text-text-tertiary hover:text-text-secondary opacity-0 group-hover:opacity-100 transition-fast"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description */}
                <p className="text-[12px] text-text-tertiary font-dmsans leading-relaxed line-clamp-2 flex-1">
                  {project.description}
                </p>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className={cn(hc.color, "font-bold")}>{hc.label}</span>
                    <span className="text-text-tertiary font-mono">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-sunken rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", c.dot)}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                  {/* Members */}
                  <div className="flex items-center gap-1">
                    {project.members?.slice(0, 4).map((m: string, i: number) => (
                      <div
                        key={i}
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-bg-surface -ml-1 first:ml-0",
                          c.bg, c.text, c.border
                        )}
                      >
                        {m}
                      </div>
                    ))}
                    {(project.members?.length || 0) > 4 && (
                      <span className="text-[10px] text-text-tertiary ml-1">+{project.members.length - 4}</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-[11px] text-text-tertiary font-dmsans">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-crimson-500/70" />
                      {project.openTickets} open
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500/70" />
                      {project.closedTickets} done
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
