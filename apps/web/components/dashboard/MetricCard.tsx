"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendDirection?: "higher-is-better" | "lower-is-better";
  status?: "normal" | "warning" | "critical" | "success";
  progress?: number;
  loading?: boolean;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendDirection = "higher-is-better",
  status = "normal",
  progress,
  loading = false,
  className,
  href,
  onClick,
}: MetricCardProps) {
  const trendInfo = useMemo(() => {
    if (trend === undefined || trend === 0) return { icon: Minus, color: "text-text-tertiary", label: "0%" };
    
    const isPositive = trend > 0;
    const isGood = trendDirection === "higher-is-better" ? isPositive : !isPositive;
    
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isGood ? "text-emerald-500" : "text-crimson-500",
      label: `${isPositive ? "+" : ""}${trend}%`,
    };
  }, [trend, trendDirection]);

  const statusColor = useMemo(() => {
    switch (status) {
      case "success": return "bg-emerald-500";
      case "warning": return "bg-amber-500";
      case "critical": return "bg-crimson-500";
      default: return "bg-violet-500";
    }
  }, [status]);

  if (loading) {
    return (
      <div className={cn("bg-bg-surface border border-border-subtle p-3 rounded-lg flex flex-col justify-between h-24 animate-pulse", className)}>
        <div className="h-3 w-16 bg-bg-elevated rounded mb-2" />
        <div className="h-6 w-24 bg-bg-elevated rounded" />
        <div className="h-2 w-full bg-bg-elevated rounded mt-2" />
      </div>
    );
  }

  const content = (
    <div
      onClick={onClick}
      className={cn(
        "bg-bg-surface border border-border-subtle p-3 sm:p-4 rounded-xl transition-all duration-fast flex flex-col group relative overflow-hidden h-full gap-1.5",
        (href || onClick) ? "cursor-pointer hover:scale-[1.02] hover:border-brand-default/40 hover:shadow-lg active:scale-[0.98]" : "cursor-default",
        className
      )}
    >
      <header className="flex justify-between items-start">
        <span className="text-[10px] sm:text-xs font-mono font-bold text-text-tertiary uppercase tracking-widest leading-none">
          {label}
        </span>
      </header>

      <div className="flex items-baseline gap-1.5 line-clamp-1">
        <span className="text-xl sm:text-2xl font-dmsans font-bold text-text-primary tracking-tight leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[10px] sm:text-xs font-medium text-text-tertiary">
            {unit}
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="w-full h-1 bg-bg-sunken rounded-full overflow-hidden mt-1">
          <div
            className={cn("h-full rounded-full transition-[width] duration-700 ease-out", statusColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <footer className="flex items-center gap-1.5 mt-1 sm:mt-auto">
        <div className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-bold", trendInfo.color)}>
          <trendInfo.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="leading-none">{trendInfo.label}</span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-tertiary font-medium">
          vs last period
        </span>
      </footer>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }

  return content;
}
