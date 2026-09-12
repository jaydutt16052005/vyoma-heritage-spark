import { BookOpen, Landmark, ScrollText, Users } from "lucide-react";

export type PathId = "characters" | "story" | "context" | "sanskrit";

export const PATHS: { id: PathId; label: string; note: string; icon: typeof Users }[] = [
  { id: "characters", label: "Characters", note: "Who stands in the Sabha", icon: Users },
  { id: "story", label: "The Story", note: "Beat by beat through the hall", icon: BookOpen },
  { id: "context", label: "Cultural Context", note: "Dharma, dyuta and the assembly", icon: Landmark },
  { id: "sanskrit", label: "Original Sanskrit", note: "Hear the recorded recital", icon: ScrollText },
];

export function ChoosePath({ active, onSelect }: { active: PathId | null; onSelect: (id: PathId) => void }) {
  return (
    <section className="mt-8 rounded-2xl border border-border glass p-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-accent">What would you like to explore?</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a layer of the narrative. The story stays the same — only your way into it changes.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PATHS.map((p) => {
          const on = active === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="rounded-xl border px-4 py-3 text-left transition-all card-lift"
              style={{
                borderColor: on ? "var(--gold)" : "var(--border)",
                background: on ? "color-mix(in oklab, var(--gold) 12%, transparent)" : "transparent",
              }}
            >
              <span className="flex items-center gap-2 text-sm">
                <p.icon className="size-4 text-accent" />
                {p.label}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">{p.note}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
