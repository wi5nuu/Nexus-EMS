"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { label: "Terms of Service", href: "/legal/terms", icon: FileText },
    { label: "Privacy Policy", href: "/legal/privacy", icon: ShieldCheck },
    { label: "Cookie Notice", href: "/legal/cookies", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-bg-page flex flex-col font-dmsans selection:bg-brand-default selection:text-white">
      {/* Header */}
      <header className="h-16 border-b border-border-subtle bg-bg-panel/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="text-text-tertiary hover:text-text-primary gap-2 h-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Back</span>
          </Button>
          <Separator orientation="vertical" className="h-4 bg-border-subtle" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-none bg-brand-default flex items-center justify-center">
              <span className="text-[10px] font-syne font-bold text-white">N</span>
            </div>
            <span className="font-syne font-bold text-sm tracking-tight text-text-primary uppercase">Legal Center</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-[11px] font-bold uppercase tracking-widest transition-all",
                pathname === link.href ? "text-brand-text border-b-2 border-brand-default pb-0.5" : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 md:py-24">
        {children}
      </main>

      <footer className="py-12 border-t border-border-subtle bg-bg-sunken/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-[0.2em] opacity-40">
             Vanguard Corp Governance Framework · Compliance Version 2026.4.2
           </p>
        </div>
      </footer>
    </div>
  );
}

function Separator({ className, orientation = "horizontal" }: { className?: string; orientation?: "horizontal" | "vertical" }) {
  return (
    <div className={cn(
      "bg-border-default",
      orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
      className
    )} />
  );
}
