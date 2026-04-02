"use client";

import { 
  Target, Star, Award, 
  Plus,
  History as HistoryIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Map, Briefcase, GraduationCap, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";


const goalsData = [
  { id: "1", title: "Complete Q1 Project Alpha", progress: 85, target: "Apr 2026", status: "In Progress" },
  { id: "2", title: "Achieve 95% SLA compliance", progress: 100, target: "Mar 2026", status: "Done" },
  { id: "3", title: "Mentor 2 Junior Engineers", progress: 50, target: "Jun 2026", status: "In Progress" },
];

const reviewHistory = [
  { id: "1", cycle: "Annual Review 2025", rating: 5, feedback: "Exceptional performance in system migration.", status: "Completed", date: "Jan 2026" },
  { id: "2", cycle: "Mid-Year Review 2025", rating: 4, feedback: "Great progress, keep focusing on documentation.", status: "Completed", date: "Jul 2025" },
];

export default function PerformancePage() {
  const [careerOpen, setCareerOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [skillBeat, setSkillBeat] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => setSkillBeat(Math.random() * 2), 2000);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-syne font-bold text-3xl text-foreground tracking-tight">Performance & Growth</h1>
          <p className="text-muted-foreground mt-1 font-dmsans">Track your KPIs, career development, and feedback.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-border/50 text-foreground bg-bg-surface hover:bg-bg-elevated"
            onClick={() => setCareerOpen(true)}
          >
            <Map className="w-4 h-4 mr-2" /> View Career Path
          </Button>
          <Button 
            className="bg-brand-default hover:bg-brand-hover text-white font-bold shadow-brand"
            onClick={() => setGoalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> New Goal
          </Button>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-card border-border/50">
          <CardHeader className="text-center">
            <div className="w-24 h-24 rounded-full bg-electric-violet/10 border-2 border-electric-violet/30 flex items-center justify-center mx-auto mb-4">
              <Star className="h-10 w-10 text-electric-violet" />
            </div>
            <CardTitle className="font-syne">Current Rating</CardTitle>
            <div className="text-4xl font-bold font-syne text-electric-violet mt-1">4.8 / 5.0</div>
            <p className="text-xs text-muted-foreground mt-2 font-dmsans uppercase tracking-widest">Exceptional Performance</p>
          </CardHeader>
          <CardContent className="pt-4 border-t border-border/30">
            <div className="space-y-4">
              {[
                { label: "Technical Skills", value: 95 },
                { label: "Collaboration", value: 88 },
                { label: "Leadership", value: 72 },
              ].map((skill, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                    <span>{skill.label}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-default transition-all duration-1000 ease-in-out" 
                      style={{ width: `${skill.value + (i === 0 ? skillBeat : -skillBeat)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {/* Active Goals */}
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-syne flex items-center gap-2">
                  <Target className="h-5 w-5 text-electric-violet" />
                  Active Performance Goals
                </CardTitle>
                <CardDescription className="font-dmsans text-xs mt-1">Strategic objectives for your current performance cycle.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {goalsData.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-electric-violet/20 transition-all flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-semibold leading-tight pr-4">{goal.title}</div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${goal.status === 'Done' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                        {goal.status}
                      </div>
                    </div>
                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                        <div className="h-full bg-electric-violet transition-all duration-1000 shadow-[0_0_10px_#7c5cfc]" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <div className="text-[10px] text-muted-foreground font-dmsans pt-1">Target: {goal.target}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review History */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="font-syne flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-electric-violet" />
                Performance Review History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewHistory.map((review) => (
                  <div key={review.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-electric-violet/10 text-electric-violet">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold font-syne">{review.cycle}</div>
                        <p className="text-xs text-muted-foreground font-dmsans mt-0.5 line-clamp-1">{review.feedback}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 bg-black/20 p-2 px-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-xs font-bold text-electric-violet">{review.rating} / 5</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Rating</div>
                      </div>
                      <Separator orientation="vertical" className="h-8 bg-border/50" />
                      <div className="text-center">
                        <div className="text-xs font-bold">{review.date}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Dated</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Career Path Dialog */}
      <Dialog open={careerOpen} onOpenChange={setCareerOpen}>
        <DialogContent className="sm:max-w-[550px] bg-bg-surface border-border-default">
          <DialogHeader>
            <DialogTitle className="font-syne flex items-center gap-2">
              <Map className="h-5 w-5 text-brand-text" /> Career Path Trajectory
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            {[
              { level: "Principal Engineer", status: "Target", icon: Star, color: "text-amber-500", desc: "Strategic leadership and architecting global-scale infrastructure." },
              { level: "Senior Staff Engineer", status: "Next", icon: TrendingUp, color: "text-brand-text", desc: "Expert technical guidance across multiple departments." },
              { level: "Staff Engineer (Current)", status: "Current", icon: Zap, color: "text-emerald-500", desc: "High-impact individual contributor driving system excellence." }
            ].map((path, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={cn("h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 bg-bg-sunken", path.color.replace('text', 'border'))}>
                    <path.icon className={cn("h-5 w-5", path.color)} />
                  </div>
                  {i < 2 && <div className="w-0.5 h-full bg-border-subtle my-1" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-text-primary">{path.level}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-tertiary">{path.status}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{path.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Goal Dialog */}
      <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
        <DialogContent className="sm:max-w-[420px] bg-bg-surface border-border-default">
          <DialogHeader>
            <DialogTitle className="font-syne">Set New Performance Goal</DialogTitle>
            <DialogDescription className="text-xs">
              Define a measurable objective for your next performance cycle.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Goal Title</label>
              <input className="w-full h-9 bg-bg-sunken border border-border-subtle rounded-md px-3 text-sm focus:outline-none focus:border-brand-default" placeholder="e.g. Master Kafka Event Streams" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Target Date</label>
                <input type="date" className="w-full h-9 bg-bg-sunken border border-border-subtle rounded-md px-3 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Priority</label>
                <select className="w-full h-9 bg-bg-sunken border border-border-subtle rounded-md px-3 text-sm">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <Button className="w-full bg-brand-default hover:bg-brand-hover text-white font-bold mt-2" onClick={() => { setGoalOpen(false); toast.success("Goal saved successfully!"); }}>
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
