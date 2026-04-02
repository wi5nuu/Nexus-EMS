"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  Ticket, 
  Users, 
  Plus,
  HelpCircle,
  TrendingUp,
  LogOut,
  ChevronDown,
  Monitor,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { GlobalSearch } from "@/components/dashboard/GlobalSearch";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { clearAuth, getUser } from "@/lib/auth";
import type { LucideIcon } from "lucide-react";

type SubItem = { label: string; href: string };
type NavItem = { label: string; icon: LucideIcon; href: string; sub?: SubItem[] };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Projects", icon: Layers, href: "/dashboard/projects" },
    ]
  },
  {
    title: "Engineering",
    items: [
      { label: "Tickets", icon: Ticket, href: "/dashboard/tickets" },
    ]
  },
  {
    title: "People",
    items: [
      { 
        label: "HR & People", 
        icon: Users, 
        href: "/dashboard/hr",
        sub: [
          { label: "Leave", href: "/dashboard/hr/leave" },
          { label: "Attendance", href: "/dashboard/hr/attendance" },
          { label: "Performance", href: "/dashboard/hr/performance" },
          { label: "Payroll", href: "/dashboard/hr/payroll" },
        ]
      },
    ]
  },
  {
    title: "Analytics",
    items: [
      { label: "Analytics", icon: TrendingUp, href: "/dashboard/analytics" },
      { label: "Documentation", icon: HelpCircle, href: "/dashboard/docs" },
    ]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  const pageLabel = pathname.split("/").pop()?.replace(/-/g, " ") || "overview";

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-bg-page overflow-hidden font-dmsans">

        {/* ─── TOPBAR (44px) ─── */}
        <header className="h-11 sticky top-0 z-50 bg-bg-panel/90 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-3 shrink-0">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-text-secondary hover:text-text-primary shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded bg-brand-default flex items-center justify-center shrink-0">
                <span className="text-[9px] font-syne font-bold text-white">N</span>
              </div>
              <span className="hidden sm:inline font-syne font-semibold text-xs tracking-tight text-text-primary">
                Nexus EMS
              </span>
            </div>

            <Separator orientation="vertical" className="h-3.5 mx-1 bg-border-subtle hidden sm:block" />

            <span className="text-[10px] font-mono font-medium text-text-tertiary uppercase tracking-widest truncate max-w-[80px] sm:max-w-[140px]">
              {pageLabel}
            </span>
          </div>

          {/* Center: Search (desktop) */}
          <div className="flex-1 max-w-xs mx-3 hidden md:block">
            <GlobalSearch />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-text-secondary hover:text-text-primary"
              onClick={() => router.push("/dashboard/tickets/new")}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>

            <Button variant="ghost" size="icon" className="h-7 w-7 text-text-secondary hover:text-emerald-500 relative hidden sm:flex">
              <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Monitor className="h-3.5 w-3.5" />
            </Button>

            <NotificationCenter />

            <Separator orientation="vertical" className="h-3.5 mx-1 bg-border-subtle" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-7 p-0 px-1.5 flex items-center gap-1.5 hover:bg-bg-elevated transition-fast">
                  <Avatar className="h-5 w-5 border border-border-default">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                    <AvatarFallback className="text-[9px]">
                      {user ? `${user.firstName[0]}${user.lastName[0]}` : "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-2.5 w-2.5 text-text-tertiary hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-bg-surface border-border-default shadow-lg">
                <DropdownMenuLabel className="font-syne text-[10px] text-text-secondary">MY ACCOUNT</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer text-xs font-medium p-2 focus:bg-brand-muted focus:text-brand-text"
                  onClick={() => router.push("/dashboard/settings/profile")}
                >
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-xs font-medium p-2 focus:bg-brand-muted focus:text-brand-text"
                  onClick={() => router.push("/dashboard/settings/preferences")}
                >
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-subtle" />
                <DropdownMenuItem
                  className="cursor-pointer text-xs font-medium p-2 text-crimson-500 focus:bg-crimson-500/10 focus:text-crimson-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">

          {/* ─── SIDEBAR OVERLAY (mobile) ─── */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-bg-overlay md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ─── SIDEBAR ─── */}
          <aside className={cn(
            // On mobile: fixed overlay sliding from left
            "fixed md:relative inset-y-0 left-0 z-40 flex flex-col bg-bg-panel border-r border-border-subtle transition-transform duration-200 ease-out",
            // Mobile: 200px wide, slides in/out
            "w-[200px]",
            // Mobile visibility
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            // Desktop: always visible, but collapses to icon-only
            "md:relative md:shrink-0"
          )}>
            {/* Workspace Selector */}
            <div className="p-2.5 pt-3">
              <Button variant="outline" className="w-full justify-between h-8 px-2.5 border-border-default bg-bg-surface hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-fast overflow-hidden">
                <div className="flex items-center gap-2 truncate">
                  <div className="h-3.5 w-3.5 rounded bg-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-[7px] font-bold text-white">N</span>
                  </div>
                  <span className="text-[11px] font-semibold truncate">Nexus Corp</span>
                </div>
                <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-4 custom-scrollbar">
              {navGroups.map((group) => (
                <div key={group.title} className="space-y-0.5">
                  <h3 className="px-2 text-[9px] font-mono font-medium text-text-tertiary uppercase tracking-wider mb-1.5">
                    {group.title}
                  </h3>
                  {group.items.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-fast relative text-[12px]",
                          pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                            ? "bg-brand-muted text-brand-text font-semibold"
                            : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary font-medium"
                        )}
                      >
                        {(pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))) && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-brand-default rounded-full" />
                        )}
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {item.label === "Tickets" && (
                          <span className="ml-auto bg-crimson-500 text-[9px] text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">
                            3
                          </span>
                        )}
                      </Link>

                      {item.sub && pathname.startsWith(item.href) && (
                        <div className="ml-5 mt-0.5 border-l border-border-subtle pl-3 space-y-0.5 py-0.5">
                          {item.sub.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "block text-[11px] py-1 px-2 rounded transition-fast font-medium",
                                pathname === sub.href
                                  ? "text-brand-text bg-brand-muted/30"
                                  : "text-text-tertiary hover:text-text-secondary hover:bg-bg-surface"
                              )}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </nav>

            {/* Profile Block */}
            <div className="p-2.5 mt-auto border-t border-border-subtle">
              <div
                className="flex items-center gap-2 p-2 rounded-lg bg-bg-surface border border-border-subtle hover:border-border-strong transition-fast cursor-pointer"
                onClick={() => router.push("/dashboard/settings/profile")}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-6 w-6 border border-border-default">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                    <AvatarFallback className="text-[9px]">AK</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border-2 border-bg-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-text-primary truncate">
                    {user ? `${user.firstName} ${user.lastName}` : "Wisnu Dev"}
                  </p>
                  <p className="text-[9px] text-text-tertiary truncate">
                    {user?.email || "admin@nexus.co"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <main className="flex-1 flex flex-col min-w-0 bg-bg-page overflow-hidden">
            {/* Sub-header (40px) */}
            <div className="h-10 border-b border-border-subtle flex items-center justify-between px-3 sm:px-4 shrink-0 bg-bg-page/50 backdrop-blur-sm">
              <nav className="flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary">
                <Link href="/dashboard" className="hover:text-text-secondary transition-fast">Nexus EMS</Link>
                <span>/</span>
                <span className="text-text-secondary capitalize">{pageLabel}</span>
              </nav>
              <div className="flex items-center gap-1.5">
                <Button
                  onClick={() => router.push("/dashboard/docs")}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 border-border-default text-[10px] font-semibold bg-bg-surface hover:bg-bg-elevated transition-fast hidden sm:flex"
                >
                  View Docs
                </Button>
                <Button
                  onClick={() => alert("Generating full platform report...")}
                  size="sm"
                  className="h-6 px-2 bg-brand-default hover:bg-brand-hover text-white text-[10px] font-bold transition-fast"
                >
                  Export
                </Button>
              </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4">
                {children}
              </div>
            </div>
          </main>

        </div>
      </div>
    </AuthGuard>
  );
}
