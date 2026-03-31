"use client";

import { 
  Download,
  TrendingUp,
  PieChart,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

const salaryBreakdown = [
  { label: "Base Salary", value: "$8,500.00", color: "text-text-primary" },
  { label: "Performance Bonus", value: "$1,200.00", color: "text-emerald-500" },
  { label: "Travel Allowance", value: "$300.00", color: "text-text-primary" },
  { label: "Remote Work Stipend", value: "$150.00", color: "text-text-primary" },
  { label: "Income Tax (PPH 21)", value: "-$1,840.00", color: "text-crimson-500" },
  { label: "Pension Contribution", value: "-$250.00", color: "text-crimson-500" },
];

const payslips = [
  { period: "March 2026", amount: "$8,060.00", status: "Paid", date: "Mar 25, 2026" },
  { period: "February 2026", amount: "$8,060.00", status: "Paid", date: "Feb 25, 2026" },
  { period: "January 2026", amount: "$8,060.00", status: "Paid", date: "Jan 25, 2026" },
];

export default function PayrollPage() {
  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0 py-4 sm:py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="font-syne font-bold text-lg sm:text-xl text-text-primary tracking-tight">Payroll & Benefits</h1>
          <p className="text-text-secondary mt-0.5 font-dmsans text-[11px] sm:text-[13px]">Secure access to your compensation details and tax documents.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none h-8 px-2.5 border-border-default bg-bg-surface hover:bg-bg-elevated text-text-secondary hover:text-text-primary text-[11px] sm:text-xs font-medium transition-fast"
            onClick={() => alert("Downloading all available tax documents...")}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> Tax Forms
          </Button>
          <Button 
            className="flex-1 sm:flex-none h-8 px-3 bg-brand-default hover:bg-brand-hover text-white text-[11px] sm:text-xs font-bold transition-fast shadow-brand"
            onClick={() => alert("Redirecting to banking partner setup...")}
          >
            Configure Banking
          </Button>
        </div>
      </div>

      {/* Summary Stats Carousel */}
      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
        <Card className="min-w-[150px] w-[50vw] sm:w-auto shrink-0 snap-center bg-bg-surface border-border-subtle overflow-hidden relative group p-3 sm:p-4 rounded-xl flex flex-col justify-between h-full">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <div className="pb-1.5 sm:pb-2">
            <h3 className="text-[10px] sm:text-xs font-bold text-text-tertiary uppercase tracking-widest font-dmsans leading-none">
              Net Pay (Monthly)
            </h3>
          </div>
          <div className="mt-auto">
            <div className="text-xl sm:text-3xl font-bold font-dmsans text-text-primary leading-none">$8,060.00</div>
            <p className="text-[9px] sm:text-[10px] text-emerald-500 font-bold mt-1.5 sm:mt-2 font-dmsans flex items-center gap-1 uppercase tracking-widest leading-none">
              <TrendingUp className="h-2.5 w-2.5" /> Scheduled for Mar 25
            </p>
          </div>
        </Card>

        <Card className="min-w-[150px] w-[50vw] sm:w-auto shrink-0 snap-center bg-bg-surface border-border-subtle overflow-hidden relative group p-3 sm:p-4 rounded-xl flex flex-col justify-between h-full">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-default/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <div className="pb-1.5 sm:pb-2">
            <h3 className="text-[10px] sm:text-xs font-bold text-text-tertiary uppercase tracking-widest font-dmsans leading-none">
              Total Bonus (YTD)
            </h3>
          </div>
          <div className="mt-auto">
            <div className="text-xl sm:text-3xl font-bold font-dmsans text-text-primary leading-none">$3,600.00</div>
            <p className="text-[9px] sm:text-[10px] text-brand-text font-bold mt-1.5 sm:mt-2 font-dmsans uppercase tracking-widest leading-none">
              Based on performance metrics
            </p>
          </div>
        </Card>

        <Card className="min-w-[150px] w-[50vw] sm:w-auto shrink-0 snap-center bg-bg-surface border-border-subtle overflow-hidden relative group p-3 sm:p-4 rounded-xl flex flex-col justify-between h-full">
          <div className="pb-1.5 sm:pb-2">
            <h3 className="text-[10px] sm:text-xs font-bold text-brand-text/80 uppercase tracking-widest font-dmsans leading-none">
              Next Review
            </h3>
          </div>
          <div className="mt-auto">
            <div className="text-xl sm:text-3xl font-bold font-dmsans text-text-primary leading-none">92 Days</div>
            <p className="text-[9px] sm:text-[10px] text-text-tertiary font-bold mt-1.5 sm:mt-2 font-dmsans uppercase tracking-widest leading-none">
              Annual compensation cycle
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Breakdown */}
        <Card className="bg-bg-surface border-border-subtle p-3 sm:p-4 rounded-xl flex flex-col shadow-sm">
          <div className="pb-3 border-b border-border-subtle mb-3">
            <h3 className="font-syne font-bold text-xs sm:text-[13px] text-text-primary flex items-center gap-2">
              <PieChart className="h-4 w-4 text-brand-text" /> Salary Breakdown
            </h3>
            <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5">Current period compensation components.</p>
          </div>
          <div className="space-y-2.5">
            {salaryBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center group">
                <span className="text-[11px] sm:text-xs text-text-secondary font-dmsans group-hover:text-text-primary transition-colors">{item.label}</span>
                <span className={cn("text-[11px] sm:text-xs font-bold font-sans tabular-nums", item.color)}>{item.value}</span>
              </div>
            ))}
            <div className="pt-2.5 mt-1 border-t border-border-subtle flex justify-between items-center">
              <span className="text-xs sm:text-sm font-bold font-syne text-text-primary">Total Take Home</span>
              <span className="text-[13px] sm:text-lg font-bold font-sans text-brand-text">$8,060.00</span>
            </div>
          </div>
        </Card>

        {/* Payslips List */}
        <Card className="bg-bg-surface border-border-subtle p-3 sm:p-4 rounded-xl flex flex-col shadow-sm">
          <div className="flex flex-row items-center justify-between pb-3 border-b border-border-subtle mb-3">
            <div>
              <h3 className="font-syne font-bold text-xs sm:text-[13px] text-text-primary">Payslip History</h3>
              <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5">Access and download your historical payslips.</p>
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] sm:text-[10px] font-bold text-brand-text/90 hover:text-brand-text hover:bg-bg-elevated transition-colors">
              EXPORT CSV
            </Button>
          </div>
          <div className="space-y-2">
            {payslips.map((slip, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-sunken border border-border-default hover:border-brand-default/40 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 rounded-md bg-bg-elevated text-text-tertiary group-hover:text-brand-text transition-colors shrink-0">
                    <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] sm:text-xs font-bold text-text-primary truncate">{slip.period}</div>
                    <div className="text-[9px] sm:text-[10px] text-text-tertiary font-dmsans uppercase tracking-widest truncate">{slip.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold tabular-nums text-text-primary">{slip.amount}</div>
                    <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">{slip.status}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-bg-elevated text-text-tertiary shrink-0">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Security Message */}
      <div className="p-3 sm:p-4 rounded-lg border border-border-subtle bg-bg-sunken flex items-start gap-3 mt-4">
        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[11px] sm:text-xs font-bold font-syne text-text-primary">Secure Financial Endpoint</p>
          <p className="text-[10px] sm:text-[11px] text-text-secondary font-dmsans leading-relaxed">
            Personal financial data is encrypted at rest and in transit. Access is monitored as per Nexus Security Policy §14. 
            Remember to never share your password or security tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
