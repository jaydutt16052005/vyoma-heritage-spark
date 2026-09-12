import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AudioLines,
  ChevronRight,
  FileText,
  Gauge,
  Pause,
  Play,
  Power,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";
import { LANGUAGES, VASTRAHARAN, type LangCode } from "@/data/vyoma";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { ChoosePath, type PathId } from "@/components/ChoosePath";
import { HeritageHunt } from "@/components/HeritageHunt";
import holoxyAsset from "@/assets/vyoma-holoxy.png.asset.json";
import sanskritAudioAsset from "@/assets/vastraharan-sanskrit.opus.asset.json";

export const Route = createFileRoute("/scene/$sceneId")({
  loader: ({ params }) => {
    if (params.sceneId !== VASTRAHARAN.id) throw notFound();
    return { scene: VASTRAHARAN };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Scene unavailable — VYOMA" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.scene.title} — VYOMA Holographic Scene`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.scene.tagline },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.scene.tagline },
      ],
    };
  },
  component: ScenePage,
});

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const SANSKRIT_AUDIO_DURATION = 74.780958;

const BOOT_STAGES = [
  "Powering photonic core",
  "Calibrating tabletop lens array",
  "Loading Sabha Parva geometry",
  "Projecting",
];

function ScenePage() {
  const { scene } = Route.useLoaderData();

  const [activated, setActivated] = useState(false);
  const [bootStage, setBootStage] = useState(-1);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [lang, setLang] = useState<LangCode>("en");
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tab, setTab] = useState<"captions" | "transcript">("captions");
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [path, setPath] = useState<PathId | null>(null);
  const [explored, setExplored] = useState(false);
  const charactersRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<HTMLDivElement | null>(null);
  const sanskritRef = useRef<HTMLDivElement | null>(null);

  const choosePath = (id: PathId) => {
    setPath(id);
    const target =
      id === "characters" ? charactersRef.current : id === "story" ? storyRef.current : id === "context" ? contextRef.current : sanskritRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const sceneToAudioTime = useCallback(
    (sceneTime: number) => (sceneTime / scene.duration) * SANSKRIT_AUDIO_DURATION,
    [scene.duration],
  );

  // Hardware activation sequence
  const activate = () => {
    if (bootStage >= 0) return;
    setBootStage(0);
    BOOT_STAGES.forEach((_, i) => {
      if (i === 0) return;
      setTimeout(() => setBootStage(i), i * 850);
    });
    setTimeout(() => {
      setActivated(true);
      setPlaying(true);
    }, BOOT_STAGES.length * 850);
  };

  useEffect(() => {
    if (!playing || lang === "sa") {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      return;
    }
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = ((now - last.current) / 1000) * rate;
      last.current = now;
      setTime((t) => {
        const next = t + dt;
        if (next >= scene.duration) {
          setPlaying(false);
          return scene.duration;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, rate, scene.duration, lang]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    if (lang !== "sa" || !playing) {
      audio.pause();
      return;
    }

    const expectedAudioTime = sceneToAudioTime(time);
    if (Math.abs(audio.currentTime - expectedAudioTime) > 0.35) audio.currentTime = expectedAudioTime;
    void audio.play().catch(() => setPlaying(false));
  }, [lang, playing, rate, sceneToAudioTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const syncFromAudio = () => {
      if (lang !== "sa") return;
      setTime(Math.min(scene.duration, (audio.currentTime / SANSKRIT_AUDIO_DURATION) * scene.duration));
    };
    const finishAudio = () => {
      setTime(scene.duration);
      setPlaying(false);
    };
    audio.addEventListener("timeupdate", syncFromAudio);
    audio.addEventListener("ended", finishAudio);
    return () => {
      audio.removeEventListener("timeupdate", syncFromAudio);
      audio.removeEventListener("ended", finishAudio);
    };
  }, [lang, scene.duration]);

  const restart = useCallback(() => {
    setTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlaying(true);
  }, []);

  const seek = (t: number) => {
    const next = Math.max(0, Math.min(scene.duration, t));
    setTime(next);
    if (audioRef.current) audioRef.current.currentTime = sceneToAudioTime(next);
  };

  const selectLanguage = (nextLang: LangCode) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = sceneToAudioTime(time);
      if (nextLang === "sa" && playing) void audio.play().catch(() => setPlaying(false));
      if (nextLang !== "sa") audio.pause();
    }
    setLang(nextLang);
  };

  const currentLine = useMemo(
    () => scene.captions.find((c) => time >= c.start && time < c.end) ?? (time >= scene.duration ? scene.captions.at(-1) : scene.captions[0]),
    [time, scene],
  );

  const currentBeat = useMemo(() => {
    let b = scene.beats[0]!;
    for (const beat of scene.beats) if (time >= beat.t) b = beat;
    return b;
  }, [time, scene.beats]);

  const activeChar = scene.characters.find((c) => c.id === selectedChar) ?? null;
  const progress = (time / scene.duration) * 100;

  useEffect(() => {
    if (activated && time >= scene.duration * 0.6) setExplored(true);
  }, [activated, time, scene.duration]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <audio ref={audioRef} src={sanskritAudioAsset.url} preload="metadata" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/epics/$epicId" params={{ epicId: scene.epicId }} className="text-xs uppercase tracking-[0.3em] text-accent hover:underline">
            ← Mahabharata
          </Link>
          <h1 className="mt-3 text-5xl">{scene.title}</h1>
          <p className="mt-1 font-display text-2xl text-primary/80">{scene.sanskritTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{scene.parva} · {scene.tagline}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest">
          <span className={`size-2 rounded-full ${activated ? "bg-primary shadow-[0_0_12px_var(--gold)]" : "bg-muted-foreground"}`} />
          {activated ? "Device projecting" : "Device standby"}
        </div>
      </div>

      <ChoosePath active={path} onSelect={choosePath} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Stage */}
        <section>
          <div className="theatre-stage relative aspect-[16/10] overflow-hidden rounded-3xl border holo-grid">
            <img
              src={holoxyAsset.url}
              alt="VYOMA HOLOXY tabletop device projecting Draupadi's Vastraharan"
              className={`pointer-events-none absolute inset-0 size-full object-cover transition-all duration-700 ${activated ? "opacity-75" : "opacity-45 grayscale-[25%]"}`}
            />
            <div className="pointer-events-none absolute inset-0 bg-foreground/40" />

            {!activated ? (
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <button
                    onClick={activate}
                    disabled={bootStage >= 0}
                    className="group relative mx-auto grid size-28 place-items-center rounded-full border border-primary/60 bg-background/50 transition-transform hover:scale-105 disabled:cursor-progress"
                  >
                    <Power className={`size-9 text-primary ${bootStage >= 0 ? "animate-pulse" : ""}`} />
                    <span className="absolute inset-0 rounded-full border border-accent/50 animate-pulse-ring" />
                  </button>
                  <p className="mt-6 font-display text-2xl">
                    {bootStage < 0 ? "Activate the VYOMA device" : BOOT_STAGES[bootStage]}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {bootStage < 0
                      ? "Place the disc at the centre of the table and press to begin the upward projection."
                      : "Hold still — the beam is aligning."}
                  </p>
                  <div className="mx-auto mt-6 flex max-w-sm gap-1.5">
                    {BOOT_STAGES.map((s, i) => (
                      <span
                        key={s}
                        className="h-1 flex-1 rounded-full transition-colors duration-500"
                        style={{ background: i <= bootStage ? "var(--gold)" : "color-mix(in oklab, var(--muted) 80%, transparent)" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
                <Hologram beatTitle={currentBeat.hologram} label={currentBeat.title} playing={playing} focus={currentBeat.focus} scene={scene} />
            )}

            {activated && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground via-foreground/85 to-transparent p-6 pt-16 text-background">
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent">{currentLine?.speaker}</p>
                <p className="mt-2 min-h-16 text-2xl leading-snug">
                  {currentLine && <WordSync line={currentLine} lang={lang} time={time} />}
                </p>
              </div>
            )}
          </div>

          {/* Transport */}
          <div ref={sanskritRef} className="mt-4 rounded-2xl border border-border glass p-5">
            <div className="relative">
              <div
                className="h-2 w-full cursor-pointer rounded-full bg-secondary"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  seek(((e.clientX - r.left) / r.width) * scene.duration);
                }}
              >
                <div className="h-2 rounded-full bg-[linear-gradient(90deg,var(--saffron),var(--gold))]" style={{ width: `${progress}%` }} />
              </div>
              {scene.beats.map((b) => (
                <button
                  key={b.id}
                  title={b.title}
                  onClick={() => seek(b.t)}
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-transform hover:scale-125"
                  style={{
                    left: `${(b.t / scene.duration) * 100}%`,
                    borderColor: currentBeat.id === b.id ? "var(--gold)" : "var(--border)",
                    background: currentBeat.id === b.id ? "var(--gold)" : "var(--card)",
                  }}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => (activated ? setPlaying((p) => !p) : activate())}
                className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
              </button>
              <button
                onClick={restart}
                className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-primary/60"
                title="Restart"
              >
                <RotateCcw className="size-4" />
              </button>
              <span className="font-mono text-sm text-muted-foreground">
                {fmt(time)} / {fmt(scene.duration)}
              </span>

              <div className="ml-auto flex items-center gap-2 text-xs">
                <Gauge className="size-4 text-accent" />
                {[0.75, 1, 1.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    className={`rounded-full border px-2.5 py-1 transition-colors ${
                      rate === r ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {r}×
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <Volume2 className="size-3.5" /> Narration
              </span>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => selectLanguage(l.code)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    lang === l.code ? "border-accent bg-accent/15 text-accent" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.native}
                </button>
              ))}
              <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                <AudioLines className={`size-4 ${playing ? "text-accent" : ""}`} />
                {LANGUAGES.find((l) => l.code === lang)?.voice} {lang === "sa" ? "(recorded)" : "(mock)"}
              </span>
            </div>
          </div>

          {/* Captions / transcript */}
          <div ref={storyRef} className="mt-4 rounded-2xl border border-border glass">
            <div className="flex gap-1 border-b border-border p-2">
              {(["captions", "transcript"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-lg px-4 py-2 text-sm capitalize transition-colors ${
                    tab === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "transcript" ? <FileText className="mr-2 inline size-3.5" /> : null}
                  {t}
                </button>
              ))}
              <span className="ml-auto self-center pr-3 text-xs text-muted-foreground">Click a line to jump</span>
            </div>
            <ul className="max-h-72 overflow-y-auto p-3">
              {scene.captions.map((c, i) => {
                const on = currentLine === c;
                return (
                  <li key={i}>
                    <button
                      onClick={() => seek(c.start + 0.05)}
                      className={`flex w-full gap-4 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        on ? "bg-primary/10" : "hover:bg-secondary/60"
                      }`}
                    >
                      <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{fmt(c.start)}</span>
                      <span className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-accent">{c.speaker}</span>
                        <span className={`block text-sm ${on ? "text-foreground" : "text-muted-foreground"}`}>
                          {tab === "captions" ? c.text[lang] : `${c.text[lang]}${lang !== "en" ? ` — ${c.text.en}` : ""}`}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Side rail */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border glass p-5">
            <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <Sparkles className="size-3.5" /> Chapters
            </h2>
            <ul className="mt-3 space-y-1.5">
              {scene.beats.map((b) => {
                const on = currentBeat.id === b.id;
                return (
                  <li key={b.id}>
                    <button
                      onClick={() => seek(b.t)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        on ? "bg-primary/12 text-foreground" : "text-muted-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <span className="font-mono text-xs text-muted-foreground">{fmt(b.t)}</span>
                      <span className="min-w-0 flex-1 truncate">{b.title}</span>
                      <ChevronRight className={`size-4 ${on ? "text-primary" : "opacity-40"}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{currentBeat.summary}</p>
          </div>

          <div ref={charactersRef} className="rounded-2xl border border-border glass p-5">
            <h2 className="text-xs uppercase tracking-widest text-accent">Characters on stage</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {scene.characters.map((ch) => {
                const onStage = currentBeat.focus.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChar((s) => (s === ch.id ? null : ch.id))}
                    className="rounded-xl border p-3 text-left transition-all"
                    style={{
                      borderColor: selectedChar === ch.id ? ch.color : onStage ? `color-mix(in oklab, ${ch.color} 55%, transparent)` : "var(--border)",
                      background: onStage ? `color-mix(in oklab, ${ch.color} 12%, transparent)` : "transparent",
                      opacity: onStage || selectedChar === ch.id ? 1 : 0.6,
                    }}
                  >
                    <span className="block text-sm" style={{ color: ch.color }}>
                      {ch.name}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">{ch.role}</span>
                  </button>
                );
              })}
            </div>

            {activeChar && (
              <div className="animate-rise mt-4 rounded-xl border border-border bg-background/50 p-4">
                <p className="text-lg" style={{ color: activeChar.color }}>
                  {activeChar.name}
                </p>
                <p className="text-xs text-muted-foreground">{activeChar.epithet}</p>
                <p className="mt-3 text-sm text-muted-foreground">{activeChar.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeChar.traits.map((t) => (
                    <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 border-l-2 pl-3 font-display text-base" style={{ borderColor: activeChar.color }}>
                  “{activeChar.quote}”
                </p>
              </div>
            )}
          </div>

          <div ref={contextRef} className="rounded-2xl border border-border glass p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-accent">Live knowledge graph</h2>
              <Link to="/knowledge-graph" className="text-xs text-primary hover:underline">
                Expand
              </Link>
            </div>
            <KnowledgeGraph
              nodes={scene.graph.nodes}
              edges={scene.graph.edges}
              highlight={currentBeat.graphFocus}
              selected={selectedNode}
              onSelect={(id) => {
                setSelectedNode((s) => (s === id ? null : id));
                if (scene.characters.some((c) => c.id === id)) setSelectedChar(id);
              }}
              compact
              className="mt-3 h-80"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Highlighted nodes follow the timeline — {currentBeat.graphFocus.length} entities active in “{currentBeat.title}”.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function WordSync({ line, lang, time }: { line: { start: number; end: number; text: Record<LangCode, string> }; lang: LangCode; time: number }) {
  const words = line.text[lang].split(" ");
  const per = (line.end - line.start) / words.length;
  return (
    <>
      {words.map((w, i) => {
        const spoken = time >= line.start + per * (i + 0.85);
        return (
          <span
            key={i}
            className="transition-colors duration-200"
            style={{
              color: spoken ? "var(--gold)" : "color-mix(in oklab, var(--background) 58%, transparent)",
              textShadow: spoken ? "0 0 18px color-mix(in oklab, var(--gold) 55%, transparent)" : "none",
            }}
          >
            {w}{" "}
          </span>
        );
      })}
    </>
  );
}

function Hologram({
  beatTitle,
  label,
  playing,
  focus,
  scene,
}: {
  beatTitle: string;
  label: string;
  playing: boolean;
  focus: string[];
  scene: typeof VASTRAHARAN;
}) {
  const figures = focus
    .map((id) => scene.characters.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 3) as (typeof scene.characters)[number][];

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_oklab,var(--gold)_35%,transparent),transparent_70%)]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className={`h-24 w-full bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--gold)_25%,transparent),transparent)] ${playing ? "animate-scanline" : "opacity-0"}`} />
      </div>

      <div className="absolute left-1/2 top-8 -translate-x-1/2 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-accent">{beatTitle}</p>
        <p className="mt-1 font-display text-3xl">{label}</p>
      </div>

      <div className="absolute inset-x-0 bottom-28 flex items-end justify-center gap-10">
        {figures.map((f, i) => (
          <div key={f.id} className="animate-rise flex flex-col items-center gap-3" style={{ animationDelay: `${i * 90}ms` }}>
            <div
              className={`grid size-24 place-items-center rounded-full border ${playing ? "animate-float" : ""}`}
              style={{
                borderColor: f.color,
                background: `radial-gradient(circle at 50% 30%, color-mix(in oklab, ${f.color} 40%, transparent), transparent 70%)`,
                boxShadow: `0 0 40px -8px ${f.color}`,
                animationDelay: `${i * 300}ms`,
              }}
            >
              <span className="font-display text-3xl" style={{ color: f.color }}>
                {f.name[0]}
              </span>
            </div>
            <span className="text-xs tracking-widest" style={{ color: f.color }}>
              {f.name}
            </span>
            <span
              className="h-16 w-px"
              style={{ background: `linear-gradient(to bottom, ${f.color}, transparent)` }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-24 grid place-items-center">
        <div className="size-56 rounded-[50%] border border-accent/40 holo-grid opacity-60 animate-spin-slow" />
      </div>
    </div>
  );
}
