"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from "recharts";
import { 
  AlertCircle, CheckCircle2 
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Activity, Shield, Terminal, Filter } from "lucide-react";
import { toast } from "sonner";

const velocityData = [
  { name: "Sprint 1", points: 42 },
  { name: "Sprint 2", points: 55 },
  { name: "Sprint 3", points: 48 },
  { name: "Sprint 4", points: 64 },
  { name: "Sprint 5", points: 59 },
  { name: "Sprint 6", points: 72 },
];

const slaData = [
  { name: "Mon", compliance: 92 },
  { name: "Tue", compliance: 95 },
  { name: "Wed", compliance: 88 },
  { name: "Thu", compliance: 94 },
  { name: "Fri", compliance: 98 },
  { name: "Sat", compliance: 100 },
  { name: "Sun", compliance: 97 },
];

interface KpiData {
  totalUsers: number;
  openTickets: number;
  totalProjects: number;
  activeSprints: number;
  timestamp: string;
}

async function fetchKpis(): Promise<KpiData> {
  try {
    return await apiFetch<KpiData>("/api/v1/analytics/kpis");
  } catch {
    return {
      totalUsers: 1248,
      openTickets: 42,
      totalProjects: 15,
      activeSprints: 4,
      timestamp: new Date().toISOString()
    };
  }
}

const translations = {
  en: {
    title: "Enterprise Analytics",
    subtitle: "Real-time performance metrics across Vanguard Corp.",
    metrics: { scale: "TOTAL SCALE", open: "OPEN ISSUES", sla: "SLA ADHERENCE", velo: "TEAM VELOCITY" },
    velocityTitle: "Sprint Velocity",
    velocityDesc: "Story points delivered per sprint cycle.",
    slaTitle: "SLA Compliance Trend",
    slaDesc: "Percentage of tickets resolved within SLA target.",
    incidentsTitle: "Critical Incidents Breakdown",
    platformTitle: "Platform Health"
  },
  id: {
    title: "Analitik Perusahaan",
    subtitle: "Metrik kinerja real-time di seluruh Vanguard Corp.",
    metrics: { scale: "TOTAL SKALA", open: "ISU TERBUKA", sla: "KEPATUHAN SLA", velo: "KECEPATAN TIM" },
    velocityTitle: "Kecepatan Sprint",
    velocityDesc: "Poin cerita yang diselesaikan per siklus sprint.",
    slaTitle: "Tren Kepatuhan SLA",
    slaDesc: "Persentase tiket yang diselesaikan sesuai target SLA.",
    incidentsTitle: "Rincian Insiden Kritis",
    platformTitle: "Kesehatan Platform"
  },
  zh: {
    title: "企业分析",
    subtitle: "Vanguard Corp 全局实时性能指标。",
    metrics: { scale: "总规模", open: "未解决的问题", sla: "SLA 遵循率", velo: "团队速度" },
    velocityTitle: "Sprint 速度",
    velocityDesc: "每个 Sprint 周期交付的故事点。",
    slaTitle: "SLA 合规趋势",
    slaDesc: "在 SLA 目标内解决的工单百分比。",
    incidentsTitle: "严重事件分类",
    platformTitle: "平台健康"
  },
  es: {
    title: "Análisis Empresarial",
    subtitle: "Métricas de rendimiento en tiempo real en todo Vanguard Corp.",
    metrics: { scale: "ESCALA TOTAL", open: "PROBLEMAS", sla: "CUMPLIMIENTO SLA", velo: "RAPIDEZ EQUIPO" },
    velocityTitle: "Velocidad del Sprint",
    velocityDesc: "Puntos de historia entregados por ciclo de sprint.",
    slaTitle: "Tendencia SLA",
    slaDesc: "Porcentaje de tickets resueltos en tiempo.",
    incidentsTitle: "Desglose de Incidentes Críticos",
    platformTitle: "Salud de la Plataforma"
  },
  ja: {
    title: "エンタープライズ分析",
    subtitle: "Vanguard Corp 全体のリアルタイムのパフォーマンス指標。",
    metrics: { scale: "合計スケール", open: "オープンな問題", sla: "SLA 遵守率", velo: "チームの速度" },
    velocityTitle: "スプリントの速度",
    velocityDesc: "スプリントサイクルごとの配信ストーリーポイント。",
    slaTitle: "SLA コンプライアンスの傾向",
    slaDesc: "SLA 目標内に解決されたチケットの割合。",
    incidentsTitle: "重大なインシデントの内訳",
    platformTitle: "プラットフォームのヘルス"
  }
};

export default function AnalyticsPage() {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const { data: kpis, isLoading } = useQuery<KpiData>({
    queryKey: ["analytics-kpis"],
    queryFn: fetchKpis,
    refetchInterval: 60000,
  });

  useEffect(() => setMounted(true), []);
  const t = translations[lang as keyof typeof translations] || translations.en;

  // Heartbeat simulation for Platform Health
  const [healthFluctuation, setHealthFluctuation] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthFluctuation(Math.random() * 0.05);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    if (!kpis) return;
    const csvContent = [
      ["Metric", "Value", "Timestamp"],
      ["Total Scale", kpis.totalUsers, kpis.timestamp],
      ["Open Issues", kpis.openTickets, kpis.timestamp],
      ["Total Projects", kpis.totalProjects, kpis.timestamp],
      ["Active Sprints", kpis.activeSprints, kpis.timestamp],
      ["SLA Adherence", "94.2%", kpis.timestamp],
      ["Team Velocity", "68.4", kpis.timestamp]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Vanguard_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Vanguard Analytics Data CSV exported successfully.");
  };

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  
  if (!mounted) return null;

  return (
    <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-syne font-bold text-xl sm:text-2xl text-text-primary tracking-tight">{t.title}</h1>
          <p className="text-text-secondary mt-0.5 font-dmsans text-[11px] sm:text-sm">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDocsOpen(true)}
            className="flex-1 sm:flex-none h-8 border-border-default text-text-secondary hover:text-text-primary text-[11px] font-bold bg-bg-surface hover:bg-bg-elevated transition-all"
          >
            <FileText className="h-3.5 w-3.5 mr-2" /> View Docs
          </Button>
          <Button 
            size="sm" 
            onClick={handleExport}
            className="flex-1 sm:flex-none h-8 bg-brand-default hover:bg-brand-hover text-white text-[11px] font-bold shadow-brand transition-all"
          >
            <Download className="h-3.5 w-3.5 mr-2" /> Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex h-8 border-border-default text-text-secondary hover:text-text-primary text-[11px] font-bold bg-bg-surface hover:bg-bg-elevated transition-all"
            onClick={() => toast.info("Filter sidebar coming soon...")}
          >
            <Filter className="h-3.5 w-3.5 mr-2" />
          </Button>
        </div>
      </div>

      <Dialog open={isDocsOpen} onOpenChange={setIsDocsOpen}>
        <DialogContent className="sm:max-w-[500px] bg-bg-surface border-border-default">
          <DialogHeader>
            <DialogTitle className="font-syne text-text-primary flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-text" /> Vanguard Analytics Engine
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 font-dmsans text-sm text-text-secondary leading-relaxed">
            <p>The analytics engine aggregates telemetry from multi-cluster deployments across Vanguard Corp infrastructure.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-bg-sunken border border-border-subtle">
                <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">DATA REFRESH</p>
                <p className="text-text-primary font-bold">Real-time (WebSocket)</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-sunken border border-border-subtle">
                <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">COMPLIANCE</p>
                <p className="text-text-primary font-bold">SOX / SOC2 Certified</p>
              </div>
            </div>
            <p className="text-xs italic">Reference ID: NEX-ANLYTIC-2026-v4.2</p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
          <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label={t.metrics.scale} value={isLoading ? "—" : (kpis?.totalUsers ?? 0)} trend={2.4} trendDirection="higher-is-better" status="success" progress={100} href="/dashboard/hr" />
          <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label={t.metrics.open} value={isLoading ? "—" : (kpis?.openTickets ?? 0)} trend={-12} trendDirection="lower-is-better" status="warning" progress={42} href="/dashboard/tickets" />
          <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label={t.metrics.sla} value="94.2" unit="%" trend={1.2} trendDirection="higher-is-better" status="normal" progress={94} />
          <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label={t.metrics.velo} value="68.4" trend={8.1} trendDirection="higher-is-better" status="success" progress={85} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-3 sm:p-4 border-b border-border-subtle">
            <CardTitle className="font-syne font-bold text-sm sm:text-base text-text-primary">{t.velocityTitle}</CardTitle>
            <CardDescription className="font-dmsans text-[11px] sm:text-xs text-text-secondary mt-0.5">{t.velocityDesc}</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] sm:h-[260px] w-full pt-4 px-2 sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" fontSize={10} stroke="var(--text-tertiary)" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={10} stroke="var(--text-tertiary)" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "11px" }}
                  cursor={{ fill: "var(--brand-default)", opacity: 0.05 }}
                />
                <Bar 
                  dataKey="points" 
                  fill="var(--brand-default)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-3 sm:p-4 border-b border-border-subtle">
            <CardTitle className="font-syne font-bold text-sm sm:text-base text-text-primary">{t.slaTitle}</CardTitle>
            <CardDescription className="font-dmsans text-[11px] sm:text-xs text-text-secondary mt-0.5">{t.slaDesc}</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] sm:h-[260px] w-full pt-4 px-2 sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-default)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--brand-default)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" fontSize={10} stroke="var(--text-tertiary)" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={10} stroke="var(--text-tertiary)" tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "11px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="var(--brand-default)" 
                  fillOpacity={1} 
                  fill="url(#colorCompliance)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Incident List Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-xl shadow-sm flex flex-col pt-1">
          <CardHeader className="px-3 py-2 border-b border-border-subtle">
            <CardTitle className="font-syne font-bold text-xs sm:text-[13px] text-text-primary flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-crimson-500" />
              {t.incidentsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border-subtle">
              {[
                { title: "Database CPU Spike", status: "In Progress", impact: "High", time: "2h ago", rca: "High memory pressure on Primary-A node due to unoptimized query in Billing service.", steps: ["Scaling node vertically", "Killing zombie long-running PID"] },
                { title: "AWS Region Outage", status: "Resolved", impact: "Critical", time: "5h ago", rca: "Regional failure in us-east-1 S3 service affecting asset uploads.", steps: ["Switched to GCP failover", "Assets served from edge cache"] },
                { title: "API Gateway Timeout", status: "Triaged", impact: "Medium", time: "Yesterday", rca: "Rate limiter misconfiguration during traffic spike.", steps: ["Adjusting Redis limit threshold", "Adding burst capacity"] },
              ].map((incident, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between px-3 py-2.5 hover:bg-bg-elevated transition-fast cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("shrink-0 p-1.5 rounded-lg", incident.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-crimson-500/10 text-crimson-500')}>
                          {incident.status === 'Resolved' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-semibold text-text-primary group-hover:text-brand-text transition-fast">{incident.title}</div>
                          <div className="text-[9px] sm:text-[10px] text-text-tertiary mt-0.5">Impact: {incident.impact} · {incident.time}</div>
                        </div>
                      </div>
                      <div className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-border-default uppercase text-text-secondary tracking-widest shrink-0">
                        {incident.status}
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="bg-bg-surface border-border-default max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-sm font-syne flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-crimson-500" /> Incident Analysis: {incident.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                       <div>
                          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Root Cause</p>
                          <p className="text-xs leading-relaxed text-text-secondary">{incident.rca}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter mb-1">Resolution Steps</p>
                          <ul className="space-y-1">
                            {incident.steps.map((step, si) => (
                              <li key={si} className="text-xs text-text-primary flex items-center gap-2">
                                <Activity className="h-3 w-3 text-brand-text" /> {step}
                              </li>
                            ))}
                          </ul>
                       </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm flex flex-col pt-1">
          <CardHeader className="px-3 py-2 border-b border-border-subtle">
            <CardTitle className="font-syne font-bold text-xs sm:text-[13px] text-text-primary">{t.platformTitle}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3.5 flex-1">
            {[
              { label: "Core API Service", value: 99.98 - healthFluctuation, color: "bg-emerald-500" },
              { label: "PostgreSQL Primary", value: 99.99 - healthFluctuation/2, color: "bg-emerald-500" },
              { label: "Kafka Event Bus", value: 98.45 + healthFluctuation*3, color: "bg-amber-500" },
              { label: "MinIO Storage", value: 99.92, color: "bg-emerald-500" },
            ].map((service, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-dmsans">
                  <span className="text-text-secondary font-medium">{service.label}</span>
                  <span className="font-bold text-text-primary">{service.value.toFixed(2)}%</span>
                </div>
                <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-1000 w-full", service.color)} 
                    style={{ width: `${service.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
