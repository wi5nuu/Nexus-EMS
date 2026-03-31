"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  PlusCircle, 
  Ticket, 
  Users, 
  Layers, 
  LayoutDashboard, 
  Calendar,
  ChevronRight
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

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const recentItems = [
    { id: "NX-491", title: "Race condition in rate-limiter", type: "ticket", href: "/dashboard/tickets/NX-491" },
    { id: "PR-332", title: "Scale database read replicas", type: "project", href: "/dashboard/projects" },
    { id: "USR-02", title: "Arif Kurniawan · HR", type: "people", href: "/dashboard/hr" },
  ];

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="group relative flex items-center justify-between w-full max-w-[360px] h-9 px-3 rounded-md bg-bg-surface border border-border-default hover:bg-bg-elevated hover:border-border-strong transition-all duration-fast shadow-sm"
        aria-label="Open command palette"
      >
        <div className="flex items-center gap-2 text-text-secondary group-hover:text-text-primary">
          <Search className="h-3.5 w-3.5" />
          <span className="text-[13px] font-dmsans font-medium">Search anything...</span>
        </div>
        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-border-strong bg-bg-panel font-mono text-[10px] text-text-tertiary">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b border-border-subtle px-3 py-1">
          <Search className="h-4 w-4 text-text-tertiary mr-2 shrink-0" />
          <CommandInput 
            placeholder="Search projects, tasks, people..." 
            className="font-dmsans h-11 border-none focus:ring-0 text-[14px] text-text-primary bg-transparent placeholder:text-text-tertiary flex-1"
          />
        </div>
        <CommandList className="font-dmsans max-h-[480px] custom-scrollbar p-2">
          <CommandEmpty className="py-10 text-center text-[13px] text-text-tertiary">
            No results found. Try a different query.
          </CommandEmpty>
          
          <CommandGroup heading="Recent">
            {recentItems.map((item) => (
              <CommandItem 
                key={item.id}
                value={item.title}
                onSelect={() => runCommand(() => router.push(item.href))}
                className="group flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-7 w-7 rounded flex items-center justify-center shrink-0",
                    item.type === "ticket" ? "bg-violet-500/15 text-violet-400" : 
                    item.type === "people" ? "bg-rose-500/15 text-rose-400" :
                    "bg-teal-500/15 text-teal-400"
                  )}>
                    {item.type === "ticket" ? <Ticket className="h-3.5 w-3.5" /> : 
                     item.type === "people" ? <Users className="h-3.5 w-3.5" /> :
                     <Layers className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-text-tertiary shrink-0">{item.id}</span>
                    <span className="text-[13px] font-medium text-text-primary truncate">{item.title}</span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-text-tertiary opacity-0 group-aria-selected:opacity-100" />
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator className="my-2 bg-border-subtle" />
          
          <CommandGroup heading="Quick Actions">
            <CommandItem 
              value="create new task"
              onSelect={() => runCommand(() => router.push("/dashboard/tickets/new"))}
              className="flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <PlusCircle className="h-3.5 w-3.5" />
                </div>
                <span className="text-[13px] font-medium text-text-primary">Create new task</span>
              </div>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated">⌘T</kbd>
            </CommandItem>
            <CommandItem 
              value="create incident ticket"
              onSelect={() => runCommand(() => router.push("/dashboard/tickets"))}
              className="flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-violet-500/15 text-violet-400 flex items-center justify-center">
                  <Ticket className="h-3.5 w-3.5" />
                </div>
                <span className="text-[13px] font-medium text-text-primary">Create incident ticket</span>
              </div>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated">⌘I</kbd>
            </CommandItem>
            <CommandItem 
              value="request leave"
              onSelect={() => runCommand(() => router.push("/dashboard/hr/leave"))}
              className="flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <span className="text-[13px] font-medium text-text-primary">Request leave</span>
              </div>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated">⌘L</kbd>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-2 bg-border-subtle" />

          <CommandGroup heading="Navigation">
            <CommandItem 
              value="dashboard overview"
              onSelect={() => runCommand(() => router.push("/dashboard"))}
              className="flex items-center px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
            >
              <LayoutDashboard className="mr-3 h-4 w-4 text-text-tertiary" />
              <span className="text-[13px] font-medium text-text-primary flex-1">Overview Dashboard</span>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated">⌘1</kbd>
            </CommandItem>
            <CommandItem 
              value="projects roadmap"
              onSelect={() => runCommand(() => router.push("/dashboard/projects"))}
              className="flex items-center px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
            >
              <Layers className="mr-3 h-4 w-4 text-text-tertiary" />
              <span className="text-[13px] font-medium text-text-primary flex-1">Projects & Roadmap</span>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated">⌘2</kbd>
            </CommandItem>
            <CommandItem 
              value="engineering tickets"
              onSelect={() => runCommand(() => router.push("/dashboard/tickets"))}
              className="flex items-center px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
            >
              <Ticket className="mr-3 h-4 w-4 text-text-tertiary" />
              <span className="text-[13px] font-medium text-text-primary flex-1">Engineering Tickets</span>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated">⌘3</kbd>
            </CommandItem>
            <CommandItem 
              value="hr people employees"
              onSelect={() => runCommand(() => router.push("/dashboard/hr"))}
              className="flex items-center px-2.5 py-2 rounded-md cursor-pointer aria-selected:bg-brand-muted"
            >
              <Users className="mr-3 h-4 w-4 text-text-tertiary" />
              <span className="text-[13px] font-medium text-text-primary flex-1">HR & People</span>
              <kbd className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-elevated">⌘4</kbd>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="border-t border-border-subtle px-4 py-2 flex items-center justify-between select-none">
          <div className="flex items-center gap-3 text-[10px] font-mono font-medium text-text-tertiary">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-bg-elevated border border-border-subtle">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-bg-elevated border border-border-subtle">↵</kbd>
              select
            </span>
          </div>
          <span className="text-[10px] font-mono font-medium text-text-tertiary flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-bg-elevated border border-border-subtle">esc</kbd>
            dismiss
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
