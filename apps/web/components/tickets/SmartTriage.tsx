"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Loader2, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/auth";

interface TriageResult {
  suggestedPriority: string;
  suggestedLabels: string[];
  analysis: string;
  confidence: number;
}

export function SmartTriage({ ticketId }: { ticketId: string }) {
  const [result, setResult] = useState<TriageResult | null>(null);
  const queryClient = useQueryClient();

  const triageMutation = useMutation({
    mutationFn: () => apiFetch(`/api/v1/ai/triage/${ticketId}`, { method: "POST" }),
    onSuccess: (data) => {
      setResult(data);
    },
  });

  return (
    <div className="bg-gradient-to-br from-electric-violet/10 to-transparent border border-electric-violet/30 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-electric-violet/20 rounded-full blur-2xl -mr-4 -mt-4 transition-all group-hover:bg-electric-violet/30" />
      
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-electric-violet fill-electric-violet/20" />
        <h3 className="font-syne font-bold text-sm tracking-tight">AI Smart Triage</h3>
      </div>

      {!result ? (
        <>
          <p className="text-xs text-muted-foreground font-dmsans leading-relaxed">
            Run AI analysis to detect priority, impact, and categorize this incident.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => triageMutation.mutate()}
            disabled={triageMutation.isPending}
            className="w-full border-electric-violet/30 hover:bg-electric-violet/10 text-electric-violet font-bold text-[10px] uppercase tracking-widest h-9"
          >
            {triageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run Analysis"}
          </Button>
        </>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-500">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>Suggested Priority</span>
              <span className="text-electric-violet font-black">{Math.round(result.confidence * 100)}% Match</span>
            </div>
            <div className={`p-2 rounded-lg border flex items-center justify-center font-black text-xs ${
              result.suggestedPriority === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
            }`}>
              {result.suggestedPriority}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Analysis</div>
            <p className="text-xs text-muted-foreground font-dmsans italic leading-snug">
              &quot;{result.analysis}&quot;
            </p>
          </div>

          <div className="pt-2 border-t border-electric-violet/20 flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-electric-violet hover:bg-electric-violet/90 text-white text-[10px] font-bold h-8"
              onClick={() => {
                // In a real app, this would trigger an update mutation
                alert(`Applying ${result.suggestedPriority} priority and labels: ${result.suggestedLabels.join(', ')}`);
                setResult(null);
                queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
              }}
            >
              <Check className="h-3 w-3 mr-1" /> Apply
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-[10px] font-bold hover:bg-white/5"
              onClick={() => setResult(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
