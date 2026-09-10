import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, MapPin } from "lucide-react";
import { GLOSSARY, HERITAGE_SITES } from "@/data/vyoma";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "Heritage Sites & Terms — VYOMA" },
      { name: "description", content: "Monuments, periods and a working glossary of Indian heritage vocabulary inside VYOMA." },
      { property: "og:title", content: "Heritage Sites & Terms — VYOMA" },
      { property: "og:description", content: "Hampi to Konark, plus the vocabulary the epics assume you know." },
    ],
  }),
  component: Heritage,
});

function Heritage() {
  const [active, setActive] = useState<string>(HERITAGE_SITES[0]?.id ?? "");
  const site = HERITAGE_SITES.find((s) => s.id === active) ?? HERITAGE_SITES[0]!;

  return (
    <main className="mx-auto max-w-7xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Places</p>
      <h1 className="mt-3 text-5xl">Heritage Sites</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        The stone counterpart to the texts. Select a site to load its holographic dossier.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
          {HERITAGE_SITES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded-2xl border p-5 text-left transition-all ${
                active === s.id ? "border-primary/60 bg-primary/10" : "border-border bg-card/40 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xl">{s.name}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.period}</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-accent">
                <MapPin className="size-3.5" /> {s.region} · {s.tag}
              </p>
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border holo-grid p-8">
          <div className="pointer-events-none absolute inset-0 aurora-bg opacity-70" />
          <div className="relative">
            <Landmark className="size-8 text-primary" />
            <h2 className="mt-4 text-4xl">{site.name}</h2>
            <p className="mt-1 text-sm uppercase tracking-widest text-accent">
              {site.region} · {site.period}
            </p>
            <p className="mt-5 max-w-lg text-muted-foreground">{site.note}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Scan fidelity 4K", "12 vantage points", "Audio guide ×3"].map((x) => (
                <span key={x} className="rounded-xl border border-border bg-background/50 px-3 py-2 text-center text-xs text-muted-foreground">
                  {x}
                </span>
              ))}
            </div>
            <div className="mt-10 h-40 rounded-2xl border border-accent/30 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_oklab,var(--gold)_24%,transparent),transparent_70%)]">
              <div className="grid h-full place-items-center font-display tracking-[0.4em] text-accent/80">HOLO-SCAN</div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-3xl">Glossary</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="card-lift rounded-2xl border border-border glass p-5">
              <p className="font-display text-xl text-primary">{g.term}</p>
              <p className="mt-2 text-sm text-muted-foreground">{g.meaning}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
