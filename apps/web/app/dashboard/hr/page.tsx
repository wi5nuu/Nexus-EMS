"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Plus, Search, Filter, ArrowUpRight, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  status: string;
  department: string | { name: string };
  jobTitle: string;
  level: string;
  joined: string;
  user?: { email: string };
}

async function fetchEmployees(): Promise<Employee[]> {
  try {
    const data = await apiFetch<{ data: any[] }>("/api/v1/hr/employees");
    return (data?.data ?? []).map(user => ({
      id: user.id,
      name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.email.split('@')[0]),
      email: user.email,
      status: user.status === 'ACTIVE' ? 'Active' : (user.status === 'PENDING' ? 'Active' : 'Inactive'),
      department: user.employeeProfile?.department?.name || "Unassigned",
      jobTitle: user.employeeProfile?.jobTitle || "Vanguard Member",
      level: user.employeeProfile?.level || "Engineer",
      joined: user.employeeProfile?.joinDate || user.createdAt,
    }));
  } catch {
    return [
      { id: "1", name: "Arif Kurniawan",    email: "arif@Vanguard.co",    jobTitle: "Principal Engineer",  department: "Engineering",     status: "Active",   level: "Senior",   joined: "2023-03-15" },
      { id: "2", name: "Rania Santoso",     email: "rania@Vanguard.co",   jobTitle: "Product Manager",     department: "Product",         status: "On Leave",  level: "Lead",     joined: "2022-07-01" },
      { id: "3", name: "Damar Haryanto",    email: "damar@Vanguard.co",   jobTitle: "DevOps Engineer",     department: "Infrastructure",  status: "Active",   level: "Mid",      joined: "2023-09-20" },
    ];
  }
}

const statusConfig: Record<string, { color: string; dot: string }> = {
  "Active":   { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
  "On Leave": { color: "bg-amber-500/10 text-amber-500 border-amber-500/20",       dot: "bg-amber-500" },
  "Inactive": { color: "bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20", dot: "bg-text-tertiary" },
};

const deptColors: Record<string, string> = {
  "Engineering":     "bg-violet-500/10 text-violet-400",
  "Product":         "bg-sapphire-500/10 text-sapphire-400",
  "Infrastructure":  "bg-teal-500/10 text-teal-400",
  "Human Resources": "bg-rose-500/10 text-rose-400",
  "Quality":         "bg-amber-500/10 text-amber-500",
};

export default function HRPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    staleTime: 30_000,
  });

  const filtered = employees.filter((e: Employee) => {
    const term = search.toLowerCase();
    const deptName = typeof e.department === 'string' ? e.department : (e.department?.name || "");
    return (
      (e.name || e.user?.email || "").toLowerCase().includes(term) ||
      (e.jobTitle || "").toLowerCase().includes(term) ||
      deptName.toLowerCase().includes(term)
    );
  });

  const handleExport = () => {
    if (!employees || employees.length === 0) return;
    const csvContent = [
      ["Employee ID", "Name", "Email", "Department", "Role", "Status"],
      ...employees.map(e => [e.id, e.name, e.email, typeof e.department === 'string' ? e.department : e.department?.name, e.jobTitle, e.status])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Vanguard_employee_directory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Employee directory exported successfully.");
  };

  const activeCount = employees.filter((e: Employee) => e.status === "Active").length;
  const onLeaveCount = employees.filter((e: Employee) => e.status === "On Leave").length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 sm:space-y-6 px-4 sm:px-0 py-4 sm:py-6"
    >

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-syne font-bold text-lg sm:text-xl text-text-primary tracking-tight">HR & People</h1>
          <p className="text-text-secondary mt-0.5 font-dmsans text-[11px] sm:text-xs">
            {isLoading ? "Loading..." : `${employees.length} employees across ${new Set(employees.map((e: Employee) => typeof e.department === 'string' ? e.department : e.department?.name)).size} departments`}
          </p>
        </div>
        <div className="flex gap-1.5 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none h-8 px-2.5 border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-elevated text-[11px] sm:text-xs font-medium transition-fast"
            onClick={() => toast.info("Filter modal coming soon in next release.")}
          >
            <Filter className="h-3.5 w-3.5 mr-1.5" /> Filters
          </Button>
          <Button 
            variant="outline"
            className="flex-1 sm:flex-none h-8 px-2.5 border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-elevated text-[11px] sm:text-xs font-medium transition-fast"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export
          </Button>
          <Button 
            className="flex-1 sm:flex-none h-8 px-3 bg-brand-default hover:bg-brand-hover text-white text-[11px] sm:text-xs font-bold transition-fast shadow-brand"
            onClick={() => router.push("/dashboard/hr/new")}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Employee
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="TOTAL EMPLOYEES" value={isLoading ? "—" : employees.length} trend={12} trendDirection="higher-is-better" status="normal" progress={Math.round((activeCount / Math.max(employees.length, 1)) * 100)} />
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="OPEN POSITIONS" value="42" trend={5} trendDirection="higher-is-better" status="warning" progress={42} onClick={() => toast.loading("Redirecting to Internal Job Board...")} />
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="ON LEAVE TODAY" value={isLoading ? "—" : onLeaveCount} trend={-8} trendDirection="lower-is-better" status="normal" progress={Math.round((onLeaveCount / Math.max(employees.length, 1)) * 100)} href="/dashboard/hr/leave" />
        <MetricCard className="min-w-[140px] w-[42vw] sm:w-auto shrink-0 snap-center" label="PERFORMANCE AVG" value="4.8" unit="/5" trend={4} trendDirection="higher-is-better" status="success" progress={96} href="/dashboard/hr/performance" />
      </div>

      {/* Employee Directory List */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-2.5 sm:p-4 border-b border-border-subtle flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between bg-bg-panel/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
            <Input 
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 bg-bg-surface border-border-subtle focus-visible:ring-brand-default text-xs"
            />
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium text-text-tertiary">
            {filtered.length} of {employees.length} employees
          </p>
        </div>

        {/* Desktop Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 border-b border-border-subtle bg-bg-subtle/50 text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">
          <div className="col-span-4">Employee</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-2">Role & Level</div>
          <div className="col-span-2 text-center">Joined</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 items-center animate-pulse">
                  <div className="h-7 w-7 rounded-full bg-bg-elevated shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 bg-bg-elevated rounded" />
                    <div className="h-2 w-1/4 bg-bg-elevated rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-bg-elevated flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-text-tertiary" />
              </div>
              <p className="text-[13px] font-semibold text-text-primary">
                {search ? `No results for "${search}"` : "No employees found"}
              </p>
              <p className="text-[11px] text-text-tertiary mt-1">
                {search ? "Try different keywords" : "Add your first employee to get started"}
              </p>
            </div>
          ) : (
            filtered.map((emp: Employee) => {
              const initials = emp.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
              const st = statusConfig[emp.status] || statusConfig["Inactive"];
              const deptName = typeof emp.department === 'string' ? emp.department : (emp.department?.name || "Other");
              const dept = deptColors[deptName] || "bg-bg-elevated text-text-secondary";

              return (
                <div 
                  key={emp.id} 
                  className="group border-b border-border-subtle last:border-0 hover:bg-bg-elevated/50 transition-colors"
                >
                  {/* Desktop Row */}
                  <div className="hidden md:grid grid-cols-12 gap-3 items-center px-4 py-2 cursor-pointer" onClick={() => router.push(`/dashboard/hr/${emp.id}`)}>
                    <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-brand-muted text-brand-text flex items-center justify-center text-[10px] font-bold shrink-0 border border-brand-default/20">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-text-primary group-hover:text-brand-text transition-colors truncate">
                          {emp.name}
                        </p>
                        <p className="text-[10px] text-text-tertiary truncate">{emp.email || emp.user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={cn("inline-flex px-1.5 py-0.5 rounded text-[9px] font-medium border border-transparent whitespace-nowrap", dept)}>
                        {typeof emp.department === 'string' ? emp.department : emp.department?.name}
                      </span>
                    </div>

                    <div className="col-span-2 min-w-0">
                      <p className="text-[11px] text-text-primary font-medium truncate">{emp.jobTitle}</p>
                      <p className="text-[9px] text-text-tertiary truncate">{emp.level}</p>
                    </div>

                    <div className="col-span-2 text-center">
                      <p className="text-[11px] font-mono text-text-secondary">
                        {emp.joined ? new Date(emp.joined).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2 text-right">
                      <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border whitespace-nowrap", st.color)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", st.dot)} />
                        {emp.status}
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="md:hidden flex flex-col p-2.5 gap-2 cursor-pointer hover:bg-bg-elevated transition-colors" onClick={() => router.push(`/dashboard/hr/${emp.id}`)}>
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-brand-muted text-brand-text flex items-center justify-center text-xs font-bold shrink-0 border border-brand-default/20">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-text-primary truncate">{emp.name}</p>
                          <p className="text-[11px] text-text-tertiary truncate">{emp.email || emp.user?.email}</p>
                        </div>
                      </div>
                      <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border shrink-0", st.color)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
                        {emp.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs bg-bg-panel/30 p-2 rounded border border-border-subtle">
                      <div className="min-w-0">
                        <span className="text-text-tertiary block mb-0.5 text-[10px]">Role</span>
                        <p className="font-medium text-text-secondary truncate">{emp.jobTitle}</p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-text-tertiary block mb-0.5 text-[10px]">Department</span>
                        <p className="font-medium text-text-secondary truncate">{typeof emp.department === 'string' ? emp.department : emp.department?.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
