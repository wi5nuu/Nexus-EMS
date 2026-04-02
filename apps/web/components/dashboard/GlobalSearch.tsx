"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Ticket, 
  Calendar,
  ChevronRight,
  ShieldAlert,
  Building2,
  Sparkles,
  Zap,
  History,
  Target
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Command Palette Toggle (⌘K)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
      
      // Quick Navigation Shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 't':
            e.preventDefault();
            router.push("/dashboard/tickets/new");
            break;
          case 'i':
            e.preventDefault();
            router.push("/dashboard/tickets");
            break;
          case 'l':
            e.preventDefault();
            router.push("/dashboard/hr/leave");
            break;
          case 'g': // Goals/OKRs
            e.preventDefault();
            setOpen(true);
            break;
          case '1': e.preventDefault(); router.push("/dashboard"); break;
          case '2': e.preventDefault(); router.push("/dashboard/projects"); break;
          case '3': e.preventDefault(); router.push("/dashboard/tickets"); break;
          case '4': e.preventDefault(); router.push("/dashboard/hr"); break;
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router]);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const recentItems = [
    { id: "STRAT-01", title: "Vanguard Core Architecture", type: "goal", href: "/dashboard" },
    { id: "NX-882", title: "Scale database read replicas", type: "ticket", href: "/dashboard/tickets" },
    { id: "SEC-AUD", title: "Q2 Security Registry", type: "audit", href: "/dashboard/settings/audit" },
  ];

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="group relative flex items-center justify-between w-full max-w-[400px] h-9 px-3 rounded-lg bg-bg-panel/40 backdrop-blur-sm border border-border-default hover:bg-bg-elevated hover:border-brand-default transition-all duration-300 shadow-sm"
        aria-label="Open command palette"
      >
        <div className="flex items-center gap-2 text-text-tertiary group-hover:text-brand-text transition-fast">
          <Zap className="h-3.5 w-3.5 fill-current opacity-70" />
          <span className="text-[12px] font-syne font-bold uppercase tracking-widest opacity-80">Vanguard Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
           <span className="text-[10px] font-medium text-text-tertiary hidden sm:inline-block">Search anything...</span>
           <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-border-strong bg-black/10 font-mono text-[9px] text-text-tertiary tracking-tighter">
             ⌘K
           </kbd>
        </div>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b border-border-subtle px-4 py-1 bg-bg-panel/30">
          <Sparkles className="h-4 w-4 text-brand-text mr-3 shrink-0 animate-pulse" />
          <CommandInput 
            placeholder="Type a command or search strategic data..." 
            className="font-syne h-12 border-none focus:ring-0 text-[15px] font-bold text-text-primary bg-transparent placeholder:text-text-tertiary flex-1 uppercase tracking-tight"
          />
        </div>
        <CommandList className="font-dmsans max-h-[520px] custom-scrollbar p-2">
          <CommandEmpty className="py-14 text-center">
             <div className="h-10 w-10 bg-bg-sunken rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-5 w-5 text-text-tertiary" />
             </div>
             <p className="text-[13px] font-bold text-text-primary mb-1">No Data Detected</p>
             <p className="text-[11px] text-text-tertiary uppercase tracking-widest font-mono">Try searching for tickets, goals, or people</p>
          </CommandEmpty>
          
          <CommandGroup heading="Recent Activity">
            {recentItems.map((item) => (
              <CommandItem 
                key={item.id}
                value={item.title}
                onSelect={() => runCommand(() => router.push(item.href))}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-bg-panel border border-transparent aria-selected:border-border-subtle transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    item.type === "ticket" ? "bg-violet-500/10 text-violet-500" : 
                    item.type === "audit" ? "bg-emerald-500/10 text-emerald-500" :
                    "bg-brand-default/10 text-brand-text"
                  )}>
                    {item.type === "ticket" ? <Ticket className="h-4 w-4" /> : 
                     item.type === "audit" ? <ShieldAlert className="h-4 w-4" /> :
                     <Target className="h-4 w-4" />}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[13px] font-bold text-text-primary truncate">{item.title}</span>
                    <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">{item.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-text-tertiary opacity-0 group-aria-selected:opacity-100 uppercase tracking-widest">Select</span>
                   <ChevronRight className="h-3.5 w-3.5 text-text-tertiary opacity-0 group-aria-selected:opacity-100" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator className="my-3 bg-border-subtle opacity-50" />
          
          <CommandGroup heading="Strategic Actions (OKR Pillar)">
            <CommandItem 
              value="align new strategic objective"
              onSelect={() => runCommand(() => router.push("/dashboard"))}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-brand-default"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 group-aria-selected:bg-white/20 group-aria-selected:text-white flex items-center justify-center transition-fast">
                  <Target className="h-4 w-4" />
                </div>
                <span className="text-[13px] font-bold text-text-primary group-aria-selected:text-white transition-fast uppercase tracking-tight">Create Strategic Objective</span>
              </div>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated group-aria-selected:text-white/80 group-aria-selected:border-white/20">⌘G</kbd>
            </CommandItem>
            <CommandItem 
              value="generate AI performance pulse"
              onSelect={() => toast.info("Vanguard AI Analysis Engine initialization in progress...")}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-brand-default"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-brand-default/10 text-brand-text group-aria-selected:bg-white/20 group-aria-selected:text-white flex items-center justify-center transition-fast">
                  <History className="h-4 w-4" />
                </div>
                <span className="text-[13px] font-bold text-text-primary group-aria-selected:text-white transition-fast uppercase tracking-tight">Generate AI Review Pulse</span>
              </div>
              <span className="text-[9px] font-bold text-brand-text group-aria-selected:text-white/80 uppercase px-1.5 py-0.5 rounded bg-brand-default/10 group-aria-selected:bg-white/20">BETA</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-3 bg-border-subtle opacity-50" />
          
          <CommandGroup heading="Enterprise Command">
            <CommandItem 
              value="request operational leave"
              onSelect={() => runCommand(() => router.push("/dashboard/hr/leave"))}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-brand-default"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 group-aria-selected:bg-white/20 group-aria-selected:text-white flex items-center justify-center transition-fast">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-[13px] font-bold text-text-primary group-aria-selected:text-white transition-fast uppercase tracking-tight">Request Deployment Leave</span>
              </div>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated group-aria-selected:text-white/80 group-aria-selected:border-white/20">⌘L</kbd>
            </CommandItem>
            <CommandItem 
              value="security audit portal"
              onSelect={() => runCommand(() => router.push("/dashboard/settings/audit"))}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-brand-default"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 group-aria-selected:bg-white/20 group-aria-selected:text-white flex items-center justify-center transition-fast">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <span className="text-[13px] font-bold text-text-primary group-aria-selected:text-white transition-fast uppercase tracking-tight">Security Audit Portal</span>
              </div>
            </CommandItem>
            <CommandItem 
              value="organization hierarchy"
              onSelect={() => runCommand(() => router.push("/dashboard/settings/organization"))}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-brand-default"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-500 group-aria-selected:bg-white/20 group-aria-selected:text-white flex items-center justify-center transition-fast">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-[13px] font-bold text-text-primary group-aria-selected:text-white transition-fast uppercase tracking-tight">Vanguard Master Ledger</span>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="border-t border-border-subtle px-4 py-3 flex items-center justify-between select-none bg-bg-panel/10">
          <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-text-tertiary tracking-widest">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-md bg-bg-panel border border-border-subtle shadow-sm">↑↓</kbd>
              NAVIGATE
            </span>
            <span className="flex items-center gap-1.5 text-brand-text">
              <kbd className="px-1.5 py-0.5 rounded-md bg-brand-default text-white border border-brand-hover shadow-brand">↵</kbd>
              EXECUTE
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-text-tertiary flex items-center gap-1.5 tracking-widest">
            <kbd className="px-1.5 py-0.5 rounded-md bg-bg-panel border border-border-subtle shadow-sm">esc</kbd>
            CLOSE
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
