"use client";

import {
  Layers, Clock,
  Download, Filter, MoreHorizontal,
  Circle, ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, getUser } from "@/lib/auth";
import { toast } from "sonner";

const translations = {
  en: {
    greeting: "Good morning, Wisnu 👋",
    sprint: ["Sprint 14", "6 days left", "14 open tasks"],
    export: "Export",
    metrics: { scale: "TOTAL SCALE", open: "OPEN ISSUES", sla: "SLA ADHERENCE", velo: "TEAM VELOCITY" },
    activity: { title: "System Activity", desc: "Ticket reporting & resolution trends" },
    tasks: { title: "Recent Interactions", desc: "Latest ticket activity", viewAll: "View all tickets" },
    incidents: { title: "Critical Incidents", desc: "Active high-priority tickets", viewAll: "View all" },
    team: { title: "Team Online", desc: "3 active" }
  },
  id: {
    greeting: "Selamat pagi, Wisnu 👋",
    sprint: ["Sprint 14", "6 hari lagi", "14 tugas terbuka"],
    export: "Ekspor",
    metrics: { scale: "SKALA TOTAL", open: "ISU TERBUKA", sla: "KEPATUHAN SLA", velo: "VELOSITAS TIM" },
    activity: { title: "Aktivitas Sistem", desc: "Tren pelaporan & penyelesaian tiket" },
    tasks: { title: "Interaksi Terbaru", desc: "Aktivitas tiket terakhir", viewAll: "Lihat semua tiket" },
    incidents: { title: "Insiden Kritis", desc: "Tiket prioritas tinggi aktif", viewAll: "Lihat semua" },
    team: { title: "Tim Online", desc: "3 aktif" }
  }
};

const barDataFallback = [
  { name: "Mon", reported: 4, resolved: 2 },
  { name: "Tue", reported: 6, resolved: 4 },
  { name: "Wed", reported: 3, resolved: 5 },
  { name: "Thu", reported: 8, resolved: 3 },
  { name: "Fri", reported: 5, resolved: 6 },
  { name: "Sat", reported: 2, resolved: 1 },
  { name: "Sun", reported: 1, resolved: 2 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [mounted, setMounted] = useState(false);

  const user = getUser();
  const userName = user?.firstName 
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` 
    : user?.email?.split("@")[0] || "Engineer";

  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: () => apiFetch<{ totalUsers: number; openTickets: number; totalProjects: number; activeSprints: number }>("/api/v1/analytics/kpis"),
  });

  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ["dashboard-insights"],
    queryFn: () => apiFetch<{ recentTickets: { id: string; title: string; status: string; priority: string }[]; ticketTrend: { name: string; reported: number; resolved: number }[]; averageTicketResolutionTime: string; slaCompliance: string }>("/api/v1/analytics/insights"),
  });

  const [healthFluctuation, setHealthFluctuation] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthFluctuation(Math.random() * 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    if (!kpis) return;
    const csvContent = [
      ["Metric", "Value"],
      ["Total Scale", kpis.totalUsers],
      ["Open Issues", kpis.openTickets],
      ["Total Projects", kpis.totalProjects],
      ["Active Sprints", kpis.activeSprints],
      ["SLA Compliance", insights?.slaCompliance || "99.4%"],
      ["Avg Resolution", insights?.averageTicketResolutionTime || "2.4h"]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Vanguard_dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("System activity report exported successfully.");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl text-text-primary tracking-tight">
            {lang === "id" ? `Selamat pagi, ${userName} 👋` : `Good morning, ${userName} 👋`}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 font-dmsans text-[13px] text-text-tertiary">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-brand-default/10 text-brand-text font-bold text-[10px] tracking-widest border border-brand-default/20">
              {t.sprint[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {t.sprint[1]}
            </span>
            <span className="text-border-default opacity-50">•</span>
            <span>{t.sprint[2]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-4 border-border-default text-[13px] font-bold text-text-secondary hover:bg-bg-elevated transition-fast"
            onClick={() => toast.info("Advanced filter controls coming soon...")}
          >
            <Filter className="h-3.5 w-3.5 mr-2" /> Filter
          </Button>
          <Button 
            onClick={handleExport}
            className="h-9 px-4 bg-brand-default hover:bg-brand-hover text-white text-[13px] font-bold transition-fast shadow-brand"
          >
            <Download className="h-3.5 w-3.5 mr-2" /> {t.export}
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard 
          label={t.metrics.scale} 
          value={(isKpisLoading ? "—" : (kpis?.totalUsers ?? 0)) as string | number} 
          trend={12.5}
          status="normal"
        />
        <MetricCard 
          label={t.metrics.open} 
          value={(isKpisLoading ? "—" : (kpis?.openTickets ?? 0)) as string | number} 
          trend={-10}
          status="warning"
        />
        <MetricCard 
          label={t.metrics.sla} 
          value={(isInsightsLoading ? "—" : (insights?.slaCompliance || "99.4%")) as string | number} 
          trend={0.2}
          status="success"
        />
        <MetricCard 
          label={t.metrics.velo} 
          value={(isKpisLoading ? "—" : (kpis?.totalProjects ?? 0)) as string | number} 
          trend={18}
          status="normal"
        />
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Productivity */}
        <div className="lg:col-span-8 bg-bg-surface border border-border-default rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-syne font-bold text-lg text-text-primary tracking-tight">{t.activity.title}</h3>
              <p className="text-text-tertiary font-dmsans text-[13px]">{t.activity.desc}</p>
            </div>
              <div className="flex items-center gap-4 text-[11px] font-bold text-text-tertiary">
               <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-brand-default" /> Reported
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-brand-muted" /> Resolved
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights?.ticketTrend || barDataFallback} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-sunken)', opacity: 0.5 }} 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-panel)', 
                    border: '1px solid var(--border-default)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="reported" fill="var(--brand-default)" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="resolved" fill="var(--brand-muted)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-bg-surface border border-border-default rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-syne font-bold text-lg text-text-primary tracking-tight">{t.tasks.title}</h3>
              <MoreHorizontal className="h-4 w-4 text-text-tertiary" />
            </div>
            <div className="space-y-4">
              {isInsightsLoading ? (
                <p className="text-xs text-text-tertiary">Loading tasks...</p>
              ) : insights?.recentTickets?.length ? (
                insights.recentTickets.map((ticket: { id: string; title: string; status: string; priority: string }) => (
                  <div key={ticket.id} className="flex items-center justify-between group cursor-pointer" onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-bg-sunken border border-border-subtle flex items-center justify-center shrink-0 group-hover:border-brand-default transition-fast">
                        <Layers className="h-4 w-4 text-text-tertiary group-hover:text-brand-text" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-text-primary group-hover:text-brand-text transition-fast leading-none mb-1">{ticket.title}</p>
                        <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">{ticket.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider", 
                      ticket.priority === 'CRITICAL' ? 'text-crimson-500' : 'text-brand-text'
                    )}>
                      {ticket.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-tertiary">No recent tasks</p>
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard/tickets')}
              className="w-full mt-6 h-9 text-[11px] font-bold text-text-tertiary hover:text-brand-text hover:bg-brand-default/5 transition-fast"
            >
              {t.tasks.viewAll}
            </Button>
          </div>

          <div className="bg-brand-default rounded-2xl p-6 text-white relative overflow-hidden shadow-brand group cursor-pointer hover:scale-[1.02] transition-fast">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-fast">
              <Layers className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-80 mb-2">QUICK ACCESS</p>
              <h3 className="font-syne font-bold text-xl mb-1 tracking-tight">Active Sprints</h3>
              <p className="text-[13px] font-dmsans opacity-80 leading-snug">Monitor real-time progress of all ongoing development cycles.</p>
              <Button size="sm" className="mt-4 h-8 bg-slate-900 hover:bg-black text-white font-bold text-[11px] transition-all rounded-lg border border-white/10 shadow-lg" onClick={() => router.push('/dashboard/projects')}>
                Go to Projects <Circle className="h-2 w-2 ml-2 fill-current" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Incidents & Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-surface border border-border-default rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle bg-bg-panel/20 flex items-center justify-between">
            <div>
              <h3 className="font-syne font-bold text-text-primary tracking-tight">{t.incidents.title}</h3>
              <p className="text-[11px] text-text-tertiary font-medium">{t.incidents.desc}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard/tickets?priority=CRITICAL')}
              className="h-8 text-[11px] font-bold text-brand-text hover:bg-brand-default/5"
            >
              {t.incidents.viewAll}
            </Button>
          </div>
          <div className="divide-y divide-border-subtle">
            {isInsightsLoading ? (
               <div className="px-6 py-8 text-center text-xs text-text-tertiary">Analyzing system telemetry...</div>
            ) : insights?.recentTickets?.length ? (
              insights.recentTickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').slice(0, 3).map((inc) => (
                <div key={inc.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-bg-sunken transition-fast cursor-pointer" onClick={() => router.push(`/dashboard/tickets/${inc.id}`)}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      inc.priority === 'CRITICAL' ? 'bg-crimson-500' : 'bg-amber-500'
                    )} />
                    <div>
                      <p className="text-[13px] font-bold text-text-primary leading-tight">{inc.title}</p>
                      <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mt-0.5">{inc.id.slice(0, 8)} • ACTIVE</p>
                    </div>
                  </div>
                  <ArrowDownRight className="h-4 w-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-fast" />
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-xs text-emerald-500 font-bold bg-emerald-500/5">
                All systems nominal. No critical incidents detected.
              </div>
            )}
          </div>
        </div>

        <div className="bg-bg-surface border border-border-default rounded-2xl shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />
          <h3 className="font-syne font-bold text-text-primary tracking-tight mb-1">{t.team.title}</h3>
          <p className="text-[11px] text-text-tertiary font-medium mb-6">{t.team.desc}</p>
          <div className="flex -space-x-2 mb-6">
            {["A", "B", "C", "D"].map((n, i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-bg-surface bg-bg-sunken flex items-center justify-center text-[10px] font-bold text-text-secondary">
                {n}
              </div>
            ))}
            <div className="h-8 w-8 rounded-full border-2 border-bg-surface bg-brand-default flex items-center justify-center text-[10px] font-bold text-white shadow-brand">
              +12
            </div>
          </div>
          <div className="p-3 rounded-xl bg-bg-panel/50 border border-border-subtle">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-text-tertiary">Server Load</span>
                <span className="text-[11px] font-mono font-bold text-emerald-500">{(22 + healthFluctuation).toFixed(0)}%</span>
             </div>
             <div className="h-1.5 w-full bg-bg-sunken rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${22 + healthFluctuation}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-emerald-500" 
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
