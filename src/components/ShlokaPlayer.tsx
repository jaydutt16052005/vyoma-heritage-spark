import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import sanskritAudioAsset from "@/assets/vastraharan-sanskrit.opus.asset.json";

const PILLS = [
  { code: "sa", label: "संस्कृत" },
  { code: "hi", label: "हिन्दी" },
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
] as const;

type Pill = (typeof PILLS)[number]["code"];

const SHLOKA: Record<Pill, string[]> = {
  sa: ["नारायणं नमस्कृत्य नरं चैव नरोत्तमम् ।", "देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत् ॥"],
  hi: ["नारायण को नमस्कार कर, नरों में श्रेष्ठ नर को,", "देवी सरस्वती और व्यास को — तत्पश्चात् जय का उच्चारण करें।"],
  en: ["Saluting Narayana, and Nara, the best among men,", "and Goddess Saraswati and Vyasa — then let victory be proclaimed."],
  mr: ["नारायणाला नमस्कार करून, नरश्रेष्ठ नराला,", "देवी सरस्वती व व्यासांना — नंतर जयाचा उच्चार करावा."],
};

const TRANSLATION = [
  "Salutations to Lord Narayana, to the best among men,",
  "to Goddess Saraswati and to Vyasa, and then let there be victory.",
];

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const BARS = Array.from({ length: 28 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7)) * 0.75);

export function ShlokaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pill, setPill] = useState<Pill>("sa");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <audio ref={audioRef} src={sanskritAudioAsset.url} preload="metadata" />
      <div className="grid items-center gap-8 rounded-3xl border border-border glass p-6 sm:p-8 lg:grid-cols-[0.8fr_1.4fr_0.8fr]">
        <ArchFrame />

        <div>
          <p className="flex items-center gap-2 font-display text-2xl text-foreground">
            <Volume2 className="size-5 text-primary" /> संस्कृत श्रवणम्
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Listen to the Original Sanskrit</p>

          <div className="mt-5 font-display text-xl leading-relaxed text-foreground sm:text-2xl">
            {SHLOKA[pill].map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause Sanskrit Narration" : "Play Sanskrit Narration"}
            </button>
            <span className="text-xs tabular-nums text-muted-foreground">
              {fmt(time)} / {fmt(duration)}
            </span>
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
            {TRANSLATION.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 lg:items-end">
          <div className="flex flex-wrap gap-1.5">
            {PILLS.map((p) => (
              <button
                key={p.code}
                onClick={() => setPill(p.code)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  pill === p.code
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex h-12 items-end gap-1" aria-hidden>
            {BARS.map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-primary/70"
                style={{
                  height: `${Math.round((playing ? h * (0.55 + Math.abs(Math.sin(time * 3 + i)) * 0.6) : h * 0.5) * 100)}%`,
                  transition: "height .18s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchFrame() {
  return (
    <div className="relative mx-auto w-full max-w-56">
      <div className="relative overflow-hidden rounded-t-[999px] rounded-b-xl border border-primary/50 bg-secondary/50 p-4 shadow-[var(--shadow-elegant)]">
        <svg viewBox="0 0 100 140" className="size-full text-primary/70" fill="none" stroke="currentColor" strokeWidth="1.1">
          <path d="M50 8c18 0 30 14 30 30v88H20V38C20 22 32 8 50 8z" opacity=".5" />
          <circle cx="50" cy="42" r="9" />
          <path d="M41 51c-6 6-9 15-9 24v45h36V75c0-9-3-18-9-24" />
          <path d="M41 51 28 34M59 51l13-17" />
          <path d="M32 100h36M36 112h28" opacity=".6" />
        </svg>
      </div>
    </div>
  );
}
