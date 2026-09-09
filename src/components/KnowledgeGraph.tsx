import { useMemo } from "react";
import type { GraphEdge, GraphNode } from "@/data/vyoma";

const KIND_COLOR: Record<GraphNode["kind"], string> = {
  person: "var(--gold)",
  concept: "var(--violet-glow)",
  place: "var(--aqua)",
  object: "var(--vermilion)",
};

export function KnowledgeGraph({
  nodes,
  edges,
  highlight = [],
  selected,
  onSelect,
  className = "",
  compact = false,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlight?: string[];
  selected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  compact?: boolean;
}) {
  const active = useMemo(() => {
    const set = new Set(highlight);
    if (selected) {
      set.add(selected);
      edges.forEach((e) => {
        if (e.from === selected) set.add(e.to);
        if (e.to === selected) set.add(e.from);
      });
    }
    return set;
  }, [highlight, selected, edges]);

  const dim = active.size > 0;
  const px = (v: number) => 7 + v * 0.86;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border holo-grid ${className}`}>
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-60" />
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((e, i) => {
          const a = nodes.find((n) => n.id === e.from);
          const b = nodes.find((n) => n.id === e.to);
          if (!a || !b) return null;
          const on = active.has(a.id) && active.has(b.id);
          return (
            <line
              key={i}
              x1={px(a.x)}
              y1={px(a.y)}
              x2={px(b.x)}
              y2={px(b.y)}
              stroke={on ? "var(--gold)" : "var(--aqua)"}
              strokeWidth={on ? 0.45 : 0.18}
              opacity={dim ? (on ? 0.95 : 0.15) : 0.4}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "opacity .4s ease, stroke .4s ease" }}
            />
          );
        })}
      </svg>

      {edges.map((e, i) => {
        const a = nodes.find((n) => n.id === e.from);
        const b = nodes.find((n) => n.id === e.to);
        if (!a || !b) return null;
        const on = active.has(a.id) && active.has(b.id);
        if (!on) return null;
        return (
          <span
            key={`l-${i}`}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded bg-background/80 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-primary"
            style={{ left: `${px((a.x + b.x) / 2)}%`, top: `${px((a.y + b.y) / 2)}%` }}
          >
            {e.label}
          </span>
        );
      })}

      {nodes.map((n) => {
        const on = active.has(n.id);
        const isSel = selected === n.id;
        return (
          <button
            key={n.id}
            onClick={() => onSelect?.(n.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border backdrop-blur transition-all duration-300 ${compact ? "px-1.5 py-0.5 text-[9px]" : "px-3 py-1.5 text-xs"}`}
            style={{
              left: `${px(n.x)}%`,
              top: `${px(n.y)}%`,
              borderColor: on ? KIND_COLOR[n.kind] : "var(--border)",
              background: on ? `color-mix(in oklab, ${KIND_COLOR[n.kind]} 22%, var(--card))` : "color-mix(in oklab, var(--card) 82%, transparent)",
              boxShadow: isSel ? `0 0 26px -4px ${KIND_COLOR[n.kind]}` : on ? `0 0 16px -6px ${KIND_COLOR[n.kind]}` : "none",
              opacity: dim && !on ? 0.35 : 1,
              transform: `translate(-50%,-50%) scale(${isSel ? 1.12 : 1})`,
            }}
          >
            <span className="mr-1.5 inline-block size-1.5 rounded-full align-middle" style={{ background: KIND_COLOR[n.kind] }} />
            {n.label}
          </button>
        );
      })}
    </div>
  );
}

export const GRAPH_LEGEND = [
  { kind: "person", label: "Person" },
  { kind: "concept", label: "Concept" },
  { kind: "place", label: "Place" },
  { kind: "object", label: "Object" },
] as const;

export { KIND_COLOR };
