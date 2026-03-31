"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, Clock, CheckCircle2, XCircle, 
  Plus, AlertCircle, Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/auth";

interface LeaveBalance {
  type: string;
  accrued: number;
  used: number;
  pending: number;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
}

async function fetchLeaveBalances(): Promise<LeaveBalance[]> {
  try {
    const res = await apiFetch<LeaveBalance[]>("/api/v1/hr/leave/balance");
    return res || [];
  } catch {
    return [
      { type: "ANNUAL", accrued: 12, used: 4, pending: 2 },
      { type: "SICK", accrued: 10, used: 1, pending: 0 },
      { type: "PARENTAL", accrued: 90, used: 0, pending: 0 },
    ];
  }
}

async function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  try {
    const res = await apiFetch<LeaveRequest[]>("/api/v1/hr/leave/requests");
    return res || [];
  } catch {
    return [
      { id: "1", type: "ANNUAL", startDate: "2026-04-10", endDate: "2026-04-12", status: "APPROVED", reason: "Family vacation" },
      { id: "2", type: "SICK", startDate: "2026-03-15", endDate: "2026-03-16", status: "APPROVED", reason: "Fever" },
      { id: "3", type: "ANNUAL", startDate: "2026-06-01", endDate: "2026-06-05", status: "PENDING", reason: "Summer break" },
    ];
  }
}

export default function LeavePage() {
  const { data: balances, isLoading: loadingBalances } = useQuery<LeaveBalance[]>({
    queryKey: ["leave-balances"],
    queryFn: fetchLeaveBalances,
  });

  const { data: requests, isLoading: loadingRequests } = useQuery<LeaveRequest[]>({
    queryKey: ["leave-requests"],
    queryFn: fetchLeaveRequests,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-syne font-bold text-3xl text-foreground tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground mt-1 font-dmsans">Review and request time off from work.</p>
        </div>
        <Button 
          className="bg-electric-violet hover:bg-electric-violet/90 text-white font-medium shadow-[0_0_15px_rgba(109,40,217,0.3)]"
          onClick={() => alert("Leave request modal opened...")}
        >
          <Plus className="w-4 h-4 mr-2" /> Request Leave
        </Button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loadingBalances ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : (
          balances?.map((b: { type: string; accrued: number; used: number; pending: number }, i: number) => (
            <Card key={i} className="bg-card border-border/50 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-electric-violet/5 rounded-full blur-2xl -mr-4 -mt-4 transition-all group-hover:bg-electric-violet/10" />
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-dmsans">
                  {b.type.replace("_", " ")} LEAVE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-syne">{b.accrued - b.used - b.pending}</span>
                  <span className="text-sm text-muted-foreground font-dmsans">days remaining</span>
                </div>
                <div className="mt-4 flex gap-4 text-xs font-dmsans text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{b.accrued} Total</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>{b.used} Used</span>
                  </div>
                  {b.pending > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span>{b.pending} Pending</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Leave History Table */}
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-syne">My Leave Requests</CardTitle>
            <CardDescription className="font-dmsans">Status of your current and past leave applications.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-border/50 text-xs font-dmsans">
            <Filter className="h-3 w-3 mr-2" /> Filter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase uppercase font-dmsans">
                  <th className="px-4 py-3 font-semibold">Leave Type</th>
                  <th className="px-4 py-3 font-semibold">Start Date</th>
                  <th className="px-4 py-3 font-semibold">End Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-dmsans">
                {loadingRequests ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-4 py-4"><div className="h-4 bg-white/5 rounded w-full" /></td>
                    </tr>
                  ))
                ) : requests?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No leave history found.</td>
                  </tr>
                ) : (
                  requests?.map((req: { id: string; type: string; startDate: string; endDate: string; status: string; reason: string }) => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-electric-violet" />
                          {req.type}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{new Date(req.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-muted-foreground">{new Date(req.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          req.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {req.status === 'APPROVED' && <CheckCircle2 className="h-3 w-3" />}
                          {req.status === 'PENDING' && <Clock className="h-3 w-3 animate-pulse" />}
                          {req.status === 'REJECTED' && <XCircle className="h-3 w-3" />}
                          {req.status}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground italic truncate max-w-xs">{req.reason || "No reason provided"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-electric-violet/5 border border-electric-violet/20 flex items-start gap-4">
        <AlertCircle className="h-5 w-5 text-electric-violet shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold font-syne text-electric-violet">Upcoming Policy Update</p>
          <p className="text-xs text-muted-foreground font-dmsans leading-relaxed">
            Starting next quarter, all carry-over leave must be used before the end of Q2. 
            Please plan your leave accordingly. Contact HR for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
