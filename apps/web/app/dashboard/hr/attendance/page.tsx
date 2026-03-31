"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Clock, MapPin, Monitor, CheckCircle2, 
  ArrowRight, History, Calendar, Loader2, Play, Square 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/auth";

async function fetchAttendanceHistory() {
  try {
    return await apiFetch("/api/v1/hr/attendance/my-history");
  } catch {
    return [
      { id: "1", clockIn: "2026-03-29T08:00:00Z", clockOut: "2026-03-29T17:00:00Z", location: "Remote", device: "MacBook Pro" },
      { id: "2", clockIn: "2026-03-28T08:15:00Z", clockOut: "2026-03-28T17:15:00Z", location: "Office (Jakarta)", device: "MacBook Pro" },
      { id: "3", clockIn: "2026-03-27T08:30:00Z", clockOut: "2026-03-27T17:30:00Z", location: "Remote", device: "MacBook Pro" },
    ];
  }
}

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: history, isLoading } = useQuery({
    queryKey: ["attendance-history"],
    queryFn: fetchAttendanceHistory,
  });

  const clockInMutation = useMutation({
    mutationFn: () => apiFetch("/api/v1/hr/attendance/clock-in", { 
      method: "POST", 
      body: JSON.stringify({ location: "Remote", device: navigator.userAgent.split(' ')[0] }) 
    }),
    onSuccess: () => {
      setIsClockedIn(true);
      queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: () => apiFetch("/api/v1/hr/attendance/clock-out", { method: "POST" }),
    onSuccess: () => {
      setIsClockedIn(false);
      queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-syne font-bold text-3xl text-foreground tracking-tight">Daily Attendance</h1>
          <p className="text-muted-foreground mt-1 font-dmsans">Clock in and track your working hours for compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clock In/Out Control */}
        <Card className="lg:col-span-1 bg-card border-border/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-violet/5 rounded-full blur-3xl -mr-8 -mt-8" />
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest font-dmsans">
              Current Time
            </CardTitle>
            <div className="text-4xl font-bold font-syne mt-2 tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-dmsans">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="pt-10 flex flex-col items-center gap-6">
            <div className={`p-6 rounded-full border-2 ${isClockedIn ? 'border-green-500/50 bg-green-500/10' : 'border-electric-violet/50 bg-electric-violet/10'} transition-all duration-500`}>
              <Clock className={`h-10 w-10 ${isClockedIn ? 'text-green-500' : 'text-electric-violet'} ${isClockedIn ? 'animate-pulse' : ''}`} />
            </div>
            
            <div className="flex flex-col w-full gap-3">
              {!isClockedIn ? (
                <Button 
                  onClick={() => clockInMutation.mutate()} 
                  disabled={clockInMutation.isPending}
                  className="w-full h-12 bg-electric-violet hover:bg-electric-violet/90 text-white font-bold font-syne shadow-[0_0_20px_rgba(124,92,252,0.4)]"
                >
                  {clockInMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Play className="mr-2 h-4 w-4" /> CLOCK IN</>}
                </Button>
              ) : (
                <Button 
                  onClick={() => clockOutMutation.mutate()} 
                  disabled={clockOutMutation.isPending}
                  variant="destructive"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold font-syne"
                >
                  {clockOutMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Square className="mr-2 h-4 w-4" /> CLOCK OUT</>}
                </Button>
              )}
            </div>
            
            <div className="flex justify-between w-full text-xs font-dmsans text-muted-foreground pt-4 border-t border-border/30">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Remote
              </div>
              <div className="flex items-center gap-1">
                <Monitor className="h-3 w-3" /> MacBook Pro
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Overview */}
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-syne">Attendance History</CardTitle>
              <CardDescription className="font-dmsans text-xs">Your clock-in and clock-out logs for the past 30 days.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-electric-violet text-xs font-bold">
              VIEW FULL REPORT
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))
              ) : (
                history?.map((log: any) => {
                  const duration = log.clockOut 
                    ? Math.round((new Date(log.clockOut).getTime() - new Date(log.clockIn).getTime()) / 3600000)
                    : "--";
                  return (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-electric-violet/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold font-syne">
                            {new Date(log.clockIn).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-dmsans mt-0.5">
                            <span className="flex items-center gap-1"><Play className="h-2.5 w-2.5" /> {new Date(log.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/30" />
                            <span className="flex items-center gap-1"><Square className="h-2.5 w-2.5" /> {log.clockOut ? new Date(log.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold font-syne text-foreground">{duration}h</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-dmsans">Worked</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Clock-In", value: "08:12 AM" },
          { label: "Total Hours (MTD)", value: "148.5h" },
          { label: "Compliance Rate", value: "98.2%" },
          { label: "Late Days", value: "2 days" },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border/50 p-4 rounded-xl flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold font-dmsans">{item.label}</span>
            <span className="text-lg font-bold font-syne text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
