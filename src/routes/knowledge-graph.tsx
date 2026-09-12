import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { VASTRAHARAN } from "@/data/vyoma";
import { GRAPH_LEGEND, KIND_COLOR, KnowledgeGraph } from "@/components/KnowledgeGraph";

export const Route = createFileRoute("/knowledge-graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph — VYOMA" },
      { name: "description", content: "An interactive graph of the characters, places, objects and ideas inside the Sabha Parva." },
      { property: "og:title", content: "Knowledge Graph — VYOMA" },
      { property: "og:description", content: "Click a node to reveal its relationships across the Mahabharata's dice game." },
    ],
  }),
  component: GraphPage,
});

function GraphPage() {
  const [selected, setSelected] = useState<string | null>("draupadi");
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [reveal, setReveal] = useState<string | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (revealTimer.current) clearTimeout(revealTimer.current); }, []);

  const discover = (id: string | null) => {
    setSelected(id);
    if (!id) return;
    const keys = VASTRAHARAN.graph.edges
      .filter((e) => e.from === id || e.to === id)
      .map((e) => `${e.from}|${e.to}`);
    const fresh = keys.filter((k) => !discovered.includes(k));
    if (fresh.length === 0) return;
    setDiscovered((d) => [...d, ...fresh]);
    const label = VASTRAHARAN.graph.nodes.find((n) => n.id === id)?.label ?? "";
    setReveal(`${label} — ${fresh.length} new ${fresh.length === 1 ? "relation" : "relations"}`);
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => setReveal(null), 2600);
  };

  const node = VASTRAHARAN.graph.nodes.find((n) => n.id === selected) ?? null;
  const character = VASTRAHARAN.characters.find((c) => c.id === selected);
  const relations = VASTRAHARAN.graph.edges
    .filter((e) => e.from === selected || e.to === selected)
    .map((e) => ({
      label: e.label,
      other: VASTRAHARAN.graph.nodes.find((n) => n.id === (e.from === selected ? e.to : e.from)),
      dir: e.from === selected ? "→" : "←",
    }));

  return (
    <main className="mx-auto max-w-7xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Relations</p>
      <h1 className="mt-3 text-5xl">Knowledge Graph</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every entity in Draupadi's Vastraharan and the links between them. Select a node to isolate its neighbourhood.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {GRAPH_LEGEND.map((l) => (
          <span key={l.kind} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: KIND_COLOR[l.kind] }} /> {l.label}
          </span>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {discovered.length} / {VASTRAHARAN.graph.edges.length} connections revealed
        </span>
        <button onClick={() => discover(null)} className="text-xs text-primary hover:underline">
          Reset selection
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="relative">
          <KnowledgeGraph
            nodes={VASTRAHARAN.graph.nodes}
            edges={VASTRAHARAN.graph.edges}
            selected={selected}
            onSelect={(id) => (selected === id ? discover(null) : discover(id))}
            className="h-[34rem]"
          />
          {reveal && (
            <div className="animate-rise pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-primary/50 bg-card/95 px-4 py-2 text-xs text-primary shadow-[var(--shadow-elegant)]">
              <Sparkles className="mr-1.5 inline size-3.5" />✦ Connection Revealed · {reveal}
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-border glass p-6">
          {node ? (
            <>
              <p className="text-xs uppercase tracking-[0.25em]" style={{ color: KIND_COLOR[node.kind] }}>
                {node.kind}
              </p>
              <h2 className="mt-2 text-3xl">{node.label}</h2>
              {character && (
                <>
                  <p className="text-sm text-muted-foreground">{character.epithet}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{character.bio}</p>
                  <p className="mt-4 border-l-2 border-primary/60 pl-3 font-display text-lg text-primary/90">
                    “{character.quote}”
                  </p>
                </>
              )}
              <h3 className="mt-6 text-xs uppercase tracking-widest text-accent">Relations</h3>
              <ul className="mt-3 space-y-2">
                {relations.map((r, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setSelected(r.other?.id ?? null)}
                      className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary/60 hover:bg-secondary/50"
                    >
                      <span className="text-muted-foreground">{r.label} {r.dir} </span>
                      {r.other?.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <Info className="size-6 text-accent" />
              <p className="text-sm">Select any node to read its dossier and trace its links.</p>
            </div>
          )}
          <Link
            to="/scene/$sceneId"
            params={{ sceneId: "vastraharan" }}
            className="mt-8 block rounded-full bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground"
          >
            See the graph move with the scene
          </Link>
        </aside>
      </div>
    </main>
  );
}
