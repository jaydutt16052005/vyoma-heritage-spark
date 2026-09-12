import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Compass, RotateCcw, Sparkles } from "lucide-react";
import holoxyAsset from "@/assets/vyoma-holoxy.png.asset.json";

type Hotspot = { id: string; label: string; left: number; top: number; correct?: boolean };

const HOTSPOTS: Hotspot[] = [
  { id: "duryodhana", label: "Duryodhana", left: 27, top: 46 },
  { id: "draupadi", label: "Draupadi", left: 50, top: 38, correct: true },
  { id: "bhishma", label: "Bhishma", left: 73, top: 46 },
  { id: "shakuni", label: "Shakuni", left: 62, top: 66 },
];

const OPTIONS_CONNECTION = [
  { id: "krishna", label: "Krishna", correct: true, note: "Invoked by Draupadi, he answers with the endless cloth." },
  { id: "bhishma", label: "Bhishma", note: "Present, but he only calls dharma subtle." },
  { id: "drona", label: "Drona", note: "Seated in the Sabha, silent through the moment." },
  { id: "karna", label: "Karna", note: "He speaks against her, but the cloth is Krishna's." },
];

const OPTIONS_EVENT = [
  { id: "dyuta", label: "A game of dice in the Kuru assembly", correct: true, note: "Shakuni's loaded dice cost Yudhishthira everything." },
  { id: "war", label: "The war at Kurukshetra", note: "That comes much later — born from this very hall." },
  { id: "exile", label: "The burning of the House of Lac", note: "An earlier conspiracy, not the cause of this Sabha." },
];

type Status = "idle" | "right" | "wrong";

export function HeritageHunt() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean[]>([false, false, false]);

  const done = step > 2;
  const insights = useMemo(() => solved.filter(Boolean).length, [solved]);

  const answer = (id: string, correct?: boolean) => {
    setPicked(id);
    if (correct) {
      setStatus("right");
      setSolved((s) => s.map((v, i) => (i === step ? true : v)));
      setTimeout(() => {
        setStatus("idle");
        setPicked(null);
        setStep((s) => s + 1);
      }, 1400);
    } else {
      setStatus("wrong");
    }
  };

  const restart = () => {
    setStep(0);
    setStatus("idle");
    setPicked(null);
    setSolved([false, false, false]);
  };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-border glass">
      <div className="relative border-b border-border px-6 py-5">
        <div className="pointer-events-none absolute inset-0 aurora-bg opacity-60" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-accent">
              <Compass className="size-3.5" /> Heritage Hunt
            </p>
            <h2 className="mt-2 font-display text-3xl">Look closer. Discover the story.</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-10 rounded-full transition-colors duration-500"
                style={{ background: solved[i] ? "var(--gold)" : i === step ? "color-mix(in oklab, var(--gold) 45%, transparent)" : "color-mix(in oklab, var(--muted) 85%, transparent)" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {done ? (
          <div className="animate-rise">
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Heritage Hunt complete</p>
            <h3 className="mt-2 font-display text-3xl">You read the Sabha closely.</h3>
            <ul className="mt-5 space-y-2 text-sm">
              {["Scene explored", "Characters identified", "Cultural connection discovered"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="size-4 text-primary" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">{insights} of 3 insights discovered.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                <RotateCcw className="size-4" /> Experience again
              </button>
              <Link
                to="/knowledge-graph"
                className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-primary/60 hover:bg-secondary/60"
              >
                Explore the story
              </Link>
            </div>
          </div>
        ) : (
          <div key={step} className="animate-rise">
            {step === 0 && (
              <>
                <Prompt n={1} kind="Spot the character" q="Can you identify Draupadi in the Sabha?" />
                <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                  <img src={holoxyAsset.url} alt="Still from the Vastraharan projection" className="size-full object-cover opacity-90" />
                  <div className="pointer-events-none absolute inset-0 bg-foreground/25" />
                  {HOTSPOTS.map((h) => {
                    const on = picked === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => answer(h.id, h.correct)}
                        className="absolute size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 hover:scale-110"
                        style={{
                          left: `${h.left}%`,
                          top: `${h.top}%`,
                          borderColor: on ? (h.correct ? "var(--gold)" : "var(--vermilion)") : "color-mix(in oklab, var(--gold) 55%, transparent)",
                          background: on ? "color-mix(in oklab, var(--gold) 22%, transparent)" : "transparent",
                          boxShadow: on && h.correct ? "0 0 30px -4px var(--gold)" : "none",
                        }}
                        aria-label={`Select figure ${h.id}`}
                      >
                        <span className="block size-full rounded-full border border-accent/30" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <Prompt n={2} kind="Find the connection" q="Which character is connected to Draupadi in this scene?" />
                <Options options={OPTIONS_CONNECTION} picked={picked} onPick={answer} />
              </>
            )}

            {step === 2 && (
              <>
                <Prompt n={3} kind="Recall the story" q="What event led to this Sabha?" />
                <Options options={OPTIONS_EVENT} picked={picked} onPick={answer} />
              </>
            )}

            <div className="mt-5 min-h-10">
              {status === "right" && (
                <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Sparkles className="size-4" /> ✓ Correct — ✦ Heritage insight discovered
                </p>
              )}
              {status === "wrong" && (
                <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                  Not quite — explore the scene once more.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Prompt({ n, kind, q }: { n: number; kind: string; q: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-accent">
        Challenge {n} · {kind}
      </p>
      <p className="mt-2 font-display text-2xl">{q}</p>
    </div>
  );
}

function Options({
  options,
  picked,
  onPick,
}: {
  options: { id: string; label: string; correct?: boolean; note?: string }[];
  picked: string | null;
  onPick: (id: string, correct?: boolean) => void;
}) {
  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const on = picked === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onPick(o.id, o.correct)}
            className="rounded-xl border px-4 py-3 text-left transition-all hover:border-primary/60 hover:bg-secondary/50"
            style={{
              borderColor: on ? (o.correct ? "var(--gold)" : "var(--vermilion)") : "var(--border)",
              background: on ? `color-mix(in oklab, ${o.correct ? "var(--gold)" : "var(--vermilion)"} 12%, transparent)` : "transparent",
            }}
          >
            <span className="block text-sm">{o.label}</span>
            {on && o.note && <span className="mt-1 block text-xs text-muted-foreground">{o.note}</span>}
          </button>
        );
      })}
    </div>
  );
}
