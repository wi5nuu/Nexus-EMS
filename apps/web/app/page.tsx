import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Micro-animations / Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[20%] w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-6 py-24 mx-auto text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-syne font-bold tracking-tight text-foreground">
            <span className="block italic text-primary/80 mb-2">Nexus Corp.</span>
            Enterprise Management System
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-dmsans text-muted-foreground">
            A world-class, production-grade management platform designed for the next 
            generation of software engineering at scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button asChild size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full electric-gradient border-none">
              <Link href="/dashboard">Explore Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-primary/20 hover:bg-primary/5 rounded-full font-semibold">
              <Link href="http://localhost:8081/docs" target="_blank" rel="noopener noreferrer">Documentation</Link>
            </Button>
          </div>
        </div>

        {/* Mock Metric Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { label: "Concurrent Users", value: "100k+" },
            { label: "Uptime SLA", value: "99.95%" },
            { label: "P95 Latency", value: "<200ms" },
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-2xl glass-panel border border-white/5 bg-white/5">
              <h3 className="text-4xl font-syne font-bold text-primary mb-2">{stat.value}</h3>
              <p className="font-dmsans text-muted-foreground uppercase tracking-widest text-xs font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
