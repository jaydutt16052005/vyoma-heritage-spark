import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Flower2, Landmark, MapPin, ScrollText, Share2, User } from "lucide-react";

const ORBIT = [
  { id: "characters", label: "Characters", icon: User },
  { id: "places", label: "Places", icon: MapPin },
  { id: "events", label: "Events", icon: Landmark },
  { id: "texts", label: "Texts", icon: BookOpen },
  { id: "traditions", label: "Traditions", icon: Flower2 },
  { id: "concepts", label: "Concepts", icon: Share2 },
] as const;

export function GraphShowcase() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-70" />
      <TempleSilhouette />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
            <Flower2 className="size-3.5" /> Explore the connections
          </p>
          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">The Knowledge Graph</h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            See how characters, places, events, texts and concepts are all connected in a web of meaning.
          </p>
          <Link
            to="/knowledge-graph"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-secondary/60"
          >
            Explore Knowledge Graph
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-lg">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
            <circle cx="50" cy="50" r="36" fill="none" stroke="var(--gold)" strokeWidth="0.25" opacity=".45" strokeDasharray="1.5 1.5" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="var(--gold)" strokeWidth="0.2" opacity=".3" />
            {ORBIT.map((n, i) => {
              const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(a) * 36;
              const y = 50 + Math.sin(a) * 36;
              const on = active === n.id;
              return (
                <line
                  key={n.id}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={on ? "var(--gold)" : "var(--vermilion)"}
                  strokeWidth={on ? 0.5 : 0.2}
                  opacity={active && !on ? 0.15 : 0.55}
                  style={{ transition: "all .3s ease" }}
                />
              );
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/60 bg-secondary text-center shadow-[var(--shadow-holo)]">
            <BookOpen className="size-5 text-accent" />
            <span className="mt-1 font-display text-sm">Mahabharata</span>
          </div>

          {ORBIT.map((n, i) => {
            const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
            const left = 50 + Math.cos(a) * 36;
            const top = 50 + Math.sin(a) * 36;
            const on = active === n.id;
            return (
              <button
                key={n.id}
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n.id)}
                onBlur={() => setActive(null)}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <Link
                  to="/knowledge-graph"
                  className="grid size-12 place-items-center rounded-full border transition-all duration-300"
                  style={{
                    borderColor: on ? "var(--gold)" : "var(--border)",
                    background: on ? "color-mix(in oklab, var(--gold) 24%, var(--card))" : "var(--card)",
                    boxShadow: on ? "0 0 24px -6px var(--gold)" : "var(--shadow-elegant)",
                    transform: `scale(${on ? 1.1 : 1})`,
                  }}
                >
                  <n.icon className="size-5 text-accent" />
                </Link>
                <span className="whitespace-nowrap text-xs text-muted-foreground">{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TempleSilhouette() {
  return (
    <svg
      viewBox="0 0 400 160"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-primary/15"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 160V128h22l10-26 10 26h20V96l16-30 16 30v32h26l14-40 14 40h30v-24l18-34 18 34v24h24l12-30 12 30h26V104l16-28 16 28v56z" />
    </svg>
  );
}
