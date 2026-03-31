"use client";

import { useMemo } from "react";
import {
  TrendingUp, Users, Ticket, Layers,
  CheckCircle2, Clock,
  Download, Filter, MoreHorizontal,
  Circle, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";

const translations = {
  en: {
    greeting: "Good morning, Wisnu 👋",
    sprint: ["Sprint 14", "6 days left", "14 open tasks"],
    export: "Export",
    metrics: { scale: "TOTAL SCALE", open: "OPEN ISSUES", sla: "SLA ADHERENCE", velo: "TEAM VELOCITY" },
    activity: { title: "Weekly Activity", desc: "Commits & code reviews" },
    tasks: { title: "My Tasks", desc: "Due today & soon", viewAll: "View all tasks" },
    incidents: { title: "Critical Incidents", desc: "Active high-priority tickets", viewAll: "View all" },
    team: { title: "Team Online", desc: "3 active" }
  },
  id: {
    greeting: "Selamat pagi, Wisnu 👋",
    sprint: ["Sprint 14", "Tersisa 6 hari", "14 tugas terbuka"],
    export: "Ekspor",
    metrics: { scale: "TOTAL SKALA", open: "ISU TERBUKA", sla: "KEPATUHAN SLA", velo: "KECEPATAN TIM" },
    activity: { title: "Aktivitas Mingguan", desc: "Commit & tinjauan kode" },
    tasks: { title: "Tugas Saya", desc: "Jatuh tempo hari ini & segera", viewAll: "Lihat semua tugas" },
    incidents: { title: "Insiden Kritis", desc: "Tiket prioritas tinggi yang aktif", viewAll: "Lihat semua" },
    team: { title: "Tim Online", desc: "3 aktif" }
  },
  zh: {
    greeting: "早上好，Wisnu 👋",
    sprint: ["第14冲刺", "剩余6天", "14个开放任务"],
    export: "导出",
    metrics: { scale: "总规模", open: "开放问题", sla: "SLA 达成率", velo: "团队速度" },
    activity: { title: "每周活动", desc: "提交和代码审查" },
    tasks: { title: "我的任务", desc: "今天到期及将近", viewAll: "查看所有任务" },
    incidents: { title: "严重事件", desc: "活动的高优先级工单", viewAll: "查看全部" },
    team: { title: "在线团队", desc: "3人在线" }
  },
  es: {
    greeting: "Buenos días, Wisnu 👋",
    sprint: ["Sprint 14", "Faltan 6 días", "14 tareas abiertas"],
    export: "Exportar",
    metrics: { scale: "ESCALA TOTAL", open: "PROBLEMAS", sla: "CUMPLIMIENTO SLA", velo: "RAPIDEZ EQUIPO" },
    activity: { title: "Actividad Semanal", desc: "Commits y revisiones de código" },
    tasks: { title: "Mis Tareas", desc: "Vence hoy y pronto", viewAll: "Ver todas las tareas" },
    incidents: { title: "Incidentes Críticos", desc: "Tickets activos de alta prioridad", viewAll: "Ver todo" },
    team: { title: "Equipo en Línea", desc: "3 activos" }
  },
  ja: {
    greeting: "おはようございます、Wisnu 👋",
    sprint: ["スプリント 14", "残り 6 日", "オープンタスク 14 件"],
    export: "エクスポート",
    metrics: { scale: "総規模", open: "未解決の問題", sla: "SLA 遵守率", velo: "チームのベロシティ" },
    activity: { title: "今週のアクティビティ", desc: "コミットとコードレビュー" },
    tasks: { title: "マインタスク", desc: "今日と近日中の期限", viewAll: "すべてのタスクを表示" },
    incidents: { title: "重大なインシデント", desc: "アクティブな高優先度のチケット", viewAll: "すべて表示" },
    team: { title: "オンラインチーム", desc: "3人がオンライン" }
  }
};

const sprintData = [
  { name: "Mon", commits: 24, reviews: 8 },
  { name: "Tue", commits: 38, reviews: 14 },
  { name: "Wed", commits: 20, reviews: 9 },
  { name: "Thu", commits: 45, reviews: 18 },
  { name: "Fri", commits: 30, reviews: 11 },
  { name: "Sat", commits: 12, reviews: 3 },
  { name: "Sun", commits: 8, reviews: 2 },
];

const recentTickets = [
  { id: "NX-491", title: "Race condition in rate-limiter", priority: "CRITICAL", status: "IN_PROGRESS", assignee: "AK", ago: "2h" },
  { id: "NX-487", title: "Memory leak in worker pool", priority: "HIGH", status: "TRIAGED", assignee: "RS", ago: "4h" },
  { id: "NX-482", title: "API gateway 504 timeout spike", priority: "CRITICAL", status: "OPEN", assignee: "DH", ago: "6h" },
  { id: "NX-476", title: "SSO logout redirect broken", priority: "MEDIUM", status: "IN_PROGRESS", assignee: "AK", ago: "1d" },
];

const teamStatus = [
  { name: "Arif K.", role: "Eng Lead", status: "online", task: "NX-491" },
  { name: "Rania S.", role: "Backend", status: "away", task: "NX-487" },
  { name: "Damar H.", role: "DevOps", status: "online", task: "Infra" },
  { name: "Putri A.", role: "Frontend", status: "offline", task: "—" },
  { name: "Budi M.", role: "QA", status: "online", task: "NX-482" },
];

const myTasks = [
  { id: "NX-491", title: "Fix race condition in rate-limiter", due: "Overdue", dueColor: "text-crimson-500", done: false },
  { id: "NX-394", title: "Update API documentation for v2.4", due: "Today", dueColor: "text-amber-500", done: false },
  { id: "NX-381", title: "Deploy Redis cache layer", due: "Tomorrow", dueColor: "text-text-tertiary", done: false },
  { id: "NX-370", title: "Code review: auth module refactor", due: "Jun 20", dueColor: "text-text-tertiary", done: true },
];

const priorityColors: Record<string, string> = {
  CRITICAL: "text-crimson-500 bg-crimson-500/10",
  HIGH: "text-amber-500 bg-amber-500/10",
  MEDIUM: "text-sapphire-400 bg-sapphire-500/10",
  LOW: "text-text-tertiary bg-bg-elevated",
};

const statusColors: Record<string, string> = {
  IN_PROGRESS: "text-amber-500",
  TRIAGED: "text-sapphire-400",
  OPEN: "text-text-tertiary",
  RESOLVED: "text-emerald-500",
};

const onlineColors: Record<string, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-text-tertiary",
};

const tooltipStyle = {
  backgroundColor: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  borderRadius: "6px",
  color: "var(--text-primary)",
  fontSize: "11px",
};

export default function DashboardPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  const t = translations[lang as keyof typeof translations] || translations.en;

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Greeting */}
      <div className="flex items-start justify-between gap-2.5">
        <div>
          <h1 className="text-lg font-syne font-bold tracking-tight text-text-primary leading-tight">
            {t.greeting}
          </h1>
          <p className="font-dmsans text-[11px] sm:text-xs text-text-secondary mt-0.5">
            {t.sprint[0]} · <span className="text-amber-500 font-medium">{t.sprint[1]}</span> · {t.sprint[2]}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="outline" className="h-[26px] px-2 font-dmsans text-[10px] sm:text-xs border-border-default bg-bg-surface hover:bg-bg-elevated text-text-secondary hidden sm:flex">
            <Calendar className="mr-1.5 h-3 w-3" />
            Last 7 Days
          </Button>
          <Button
            className="h-[26px] px-2.5 font-dmsans text-[10px] sm:text-xs bg-brand-default hover:bg-brand-hover text-white font-semibold"
            onClick={() => alert("Exporting system report as PDF...")}
          >
            <Download className="mr-1.5 h-3 w-3" />
            {t.export}
          </Button>
        </div>
      </div>

      {/* KPI Cards — Horizontal scroll on mobile, 4 cols desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
        <MetricCard
          className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center"
          label={t.metrics.scale}
          value="48"
          unit="active"
          trend={2.4}
          trendDirection="higher-is-better"
          status="normal"
          progress={80}
        />
        <MetricCard
          className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center"
          label={t.metrics.open}
          value="3"
          trend={-40}
          trendDirection="lower-is-better"
          status="warning"
          progress={30}
        />
        <MetricCard
          className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center"
          label={t.metrics.sla}
          value="94.2"
          unit="%"
          trend={1.2}
          trendDirection="higher-is-better"
          status="success"
          progress={94}
        />
        <MetricCard
          className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center"
          label={t.metrics.velo}
          value="68.4"
          unit="pts"
          trend={8.1}
          trendDirection="higher-is-better"
          status="normal"
          progress={72}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        {/* Activity Chart */}
        <div className="lg:col-span-7 bg-bg-surface border border-border-subtle rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="font-syne font-bold text-xs sm:text-[13px] text-text-primary">{t.activity.title}</h3>
              <p className="font-dmsans text-[10px] sm:text-xs text-text-tertiary">{t.activity.desc}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-text-tertiary">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="h-[140px] sm:h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--border-subtle)" }} />
                <Bar dataKey="commits" fill="var(--violet-500)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="reviews" fill="var(--teal-500)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
              <div className="h-2 w-2 rounded-sm bg-violet-500" /> Commits
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
              <div className="h-2 w-2 rounded-sm bg-teal-500" /> Reviews
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-subtle rounded-lg p-3 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-syne font-bold text-xs sm:text-[13px] text-text-primary">{t.tasks.title}</h3>
              <p className="font-dmsans text-[10px] sm:text-xs text-text-tertiary">{t.tasks.desc}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-text-tertiary">
              <Filter className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1.5 flex-1">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-2.5 p-2 rounded-md border transition-fast cursor-pointer",
                  task.done ? "border-transparent opacity-40" : "border-border-subtle hover:border-border-default hover:bg-bg-elevated"
                )}
              >
                {task.done
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  : <Circle className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className={cn("text-[11px] font-medium truncate", task.done ? "line-through text-text-tertiary" : "text-text-primary")}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-mono text-text-tertiary">{task.id}</span>
                    <span className={cn("text-[9px] font-medium", task.dueColor)}>{task.due}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2.5 w-full h-7 text-[10px] border-border-subtle text-text-secondary hover:text-text-primary"
            onClick={() => router.push("/dashboard/tickets")}
          >
            {t.tasks.viewAll}
          </Button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        {/* Critical Incidents */}
        <div className="lg:col-span-8 bg-bg-surface border border-border-subtle rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
            <div>
              <h3 className="font-syne font-bold text-xs sm:text-[13px] text-text-primary">{t.incidents.title}</h3>
              <p className="font-dmsans text-[10px] sm:text-xs text-text-tertiary">{t.incidents.desc}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-[22px] px-2 text-[10px] border-border-subtle text-text-secondary font-medium"
              onClick={() => router.push("/dashboard/tickets")}
            >
              View all
            </Button>
          </div>
          <div className="divide-y divide-border-subtle">
            {recentTickets.map((t) => (
              <div key={t.id} className="flex items-center gap-2 px-3.5 py-2.5 hover:bg-bg-elevated transition-fast cursor-pointer group">
                <span className="text-[10px] font-mono font-bold text-text-tertiary w-[52px] shrink-0">{t.id}</span>
                <p className="flex-1 text-[11px] font-medium text-text-primary truncate group-hover:text-brand-text transition-fast min-w-0">
                  {t.title}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", priorityColors[t.priority])}>
                    {t.priority === "CRITICAL" ? "CRIT" : t.priority}
                  </span>
                  <div className="h-5 w-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[9px] font-bold text-violet-400 shrink-0">
                    {t.assignee}
                  </div>
                  <span className="text-[9px] text-text-tertiary w-6 text-right shrink-0">{t.ago}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Online */}
        <div className="lg:col-span-4 bg-bg-surface border border-border-subtle rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
            <h3 className="font-syne font-bold text-xs sm:text-[13px] text-text-primary">Team Online</h3>
            <span className="text-[10px] font-mono text-emerald-500 font-bold">
              {teamStatus.filter(t => t.status === "online").length} active
            </span>
          </div>
          <div className="divide-y divide-border-subtle">
            {teamStatus.map((member) => (
              <div key={member.name} className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-bg-elevated transition-fast">
                <div className="relative shrink-0">
                  <div className="h-6 w-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[9px] font-bold text-violet-400">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-bg-surface",
                    onlineColors[member.status]
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-text-primary truncate">{member.name}</p>
                  <p className="text-[9px] text-text-tertiary">{member.role}</p>
                </div>
                {member.task !== "—" && (
                  <span className="text-[9px] font-mono font-bold text-text-tertiary bg-bg-elevated px-1.5 py-0.5 rounded shrink-0">
                    {member.task}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
