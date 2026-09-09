import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Filter, Play } from "lucide-react";
import { EPICS } from "@/data/vyoma";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Heritage — VYOMA Archives" },
      { name: "description", content: "Browse the Mahabharata, Ramayana, Natyashastra and temple canon as holographic scenes." },
      { property: "og:title", content: "Explore Heritage — VYOMA Archives" },
      { property: "og:description", content: "Four living archives, each with scenes ready for holographic projection." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");

  const epics = useMemo(() => {
    return EPICS.filter((e) => filter === "all" || e.id === filter).map((e) => ({
      ...e,
      scenes: e.scenes.filter(
        (s) => !q.trim() || s.title.toLowerCase().includes(q.toLowerCase()) || s.blurb.toLowerCase().includes(q.toLowerCase()),
      ),
    }));
  }, [filter, q]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">The archive</p>
      <h1 className="mt-3 text-5xl">Explore Heritage</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Each archive is a body of text prepared for projection — scenes, characters, verses and relationships, all rendered
        by the VYOMA device.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Filter className="size-3.5" /> Archive
        </span>
        {[{ id: "all", title: "All" }, ...EPICS].map((e) => (
          <button
            key={e.id}
            onClick={() => setFilter(e.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === e.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.title}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter scenes…"
          className="ml-auto h-9 w-56 rounded-full border border-border bg-card/60 px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
        />
      </div>

      <div className="mt-10 space-y-14">
        {epics.map((e) => (
          <section key={e.id}>
            <div className="flex flex-wrap items-baseline gap-4">
              <Link to="/epics/$epicId" params={{ epicId: e.id }} className="text-3xl hover:text-primary">
                {e.title}
              </Link>
              <span className="font-display text-xl text-primary/70">{e.sanskritTitle}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{e.era}</span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{e.blurb}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {e.scenes.map((s) =>
                s.ready ? (
                  <Link
                    key={s.id}
                    to="/scene/$sceneId"
                    params={{ sceneId: s.id }}
                    className="card-lift rounded-2xl border border-primary/40 glass p-6"
                  >
                    <SceneBody scene={s} accent={e.accent} ready />
                  </Link>
                ) : (
                  <div key={s.id} className="rounded-2xl border border-border bg-card/40 p-6 opacity-70">
                    <SceneBody scene={s} accent={e.accent} />
                  </div>
                ),
              )}
              {e.scenes.length === 0 && <p className="text-sm text-muted-foreground">No scenes match that filter.</p>}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function SceneBody({
  scene,
  accent,
  ready,
}: {
  scene: { title: string; parva: string; duration: number; blurb: string };
  accent: string;
  ready?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
          {scene.parva}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {Math.round(scene.duration / 6) / 10}m
        </span>
      </div>
      <h3 className="mt-3 text-2xl">{scene.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{scene.blurb}</p>
      <p className={`mt-5 flex items-center gap-2 text-xs uppercase tracking-widest ${ready ? "text-primary" : "text-muted-foreground"}`}>
        <Play className="size-3.5" /> {ready ? "Projection ready" : "Rendering soon"}
      </p>
    </>
  );
}
