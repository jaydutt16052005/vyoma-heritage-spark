import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Languages, Play, ScanLine, Sparkles, Waypoints } from "lucide-react";
import { EPICS, VASTRAHARAN } from "@/data/vyoma";
import holoxyAsset from "@/assets/vyoma-holoxy.png.asset.json";
import { ShlokaPlayer } from "@/components/ShlokaPlayer";
import { GraphShowcase } from "@/components/GraphShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VYOMA — Holographic Theatre of Indian Heritage" },
      {
        name: "description",
        content:
          "VYOMA projects India's epics as tabletop holograms: word-synced multilingual narration, character dossiers and a living knowledge graph.",
      },
      { property: "og:title", content: "VYOMA — Holographic Theatre of Indian Heritage" },
      {
        property: "og:description",
        content: "Step into Draupadi's Vastraharan as an upward-projecting hologram with multilingual narration.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 aurora-bg opacity-80" />
        <div className="pointer-events-none absolute inset-0 holo-grid opacity-25" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">
              <Sparkles className="size-3.5" /> Heritage • Knowledge • Immersive Experience
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              The epics, <span className="gold-text">projected</span> into the room.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              VYOMA is a tabletop holographic device and archive. Place it down, activate the beam, and step into a world
              of ancient stories — narrated in your language, annotated with characters, verses and a graph of everything
              they touch.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/scene/$sceneId"
                params={{ sceneId: "vastraharan" }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                <Play className="size-4" /> Play Vastraharan
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium transition-colors hover:border-primary/60 hover:bg-secondary/50"
              >
                Explore Heritage
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                ["4", "Living archives"],
                ["3", "Narration languages"],
                ["14", "Graph entities"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-3xl gold-text">{k}</dt>
                  <dd className="text-xs uppercase tracking-widest text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroDevice />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: ScanLine, t: "Upward projection", d: "A 360° tabletop beam that renders the scene above the device, viewable from every seat in the room." },
            { icon: Languages, t: "Word-synced narration", d: "English, Hindi and Sanskrit tracks with captions that light up word by word as the reciter speaks." },
            { icon: Waypoints, t: "Living knowledge graph", d: "Every character, place and idea is a node — the graph highlights itself as the story moves." },
          ].map((f) => (
            <article key={f.t} className="card-lift rounded-2xl glass p-6">
              <f.icon className="size-6 text-accent" />
              <h3 className="mt-4 text-xl">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl">Featured scene</h2>
            <p className="mt-2 text-muted-foreground">The full VYOMA experience, ready to project.</p>
          </div>
          <Link to="/explore" className="text-sm text-primary hover:underline">
            All archives
          </Link>
        </div>

        <Link
          to="/scene/$sceneId"
          params={{ sceneId: VASTRAHARAN.id }}
          className="card-lift mt-6 block overflow-hidden rounded-3xl border border-border glass"
        >
          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">{VASTRAHARAN.parva}</p>
              <h3 className="mt-3 text-4xl">{VASTRAHARAN.title}</h3>
              <p className="mt-1 font-display text-2xl text-primary/80">{VASTRAHARAN.sanskritTitle}</p>
              <p className="mt-5 max-w-xl text-muted-foreground">{VASTRAHARAN.synopsis}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {VASTRAHARAN.beats.slice(0, 5).map((b) => (
                  <span key={b.id} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {b.title}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative min-h-64 overflow-hidden border-t border-border md:border-l md:border-t-0">
              <img
                src={holoxyAsset.url}
                alt="VYOMA HOLOXY tabletop device projecting Draupadi's Vastraharan"
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/15" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="animate-float grid size-28 place-items-center rounded-full border border-primary/60 bg-background/75 shadow-[var(--shadow-holo)] backdrop-blur">
                  <Play className="size-8 text-foreground" />
                  <span className="absolute size-28 rounded-full border border-accent/50 animate-pulse-ring" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-3xl">Archives in the device</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EPICS.map((e) => (
            <Link
              key={e.id}
              to="/epics/$epicId"
              params={{ epicId: e.id }}
              className="card-lift rounded-2xl border border-border glass p-6"
            >
              <span className="inline-block size-2 rounded-full" style={{ background: e.accent, boxShadow: `0 0 14px ${e.accent}` }} />
              <h3 className="mt-4 text-2xl">{e.title}</h3>
              <p className="font-display text-lg text-primary/80">{e.sanskritTitle}</p>
              <p className="mt-3 text-sm text-muted-foreground">{e.blurb}</p>
              <p className="mt-5 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                <Boxes className="size-3.5" /> {e.scenes.length} scenes
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function HeroDevice() {
  return (
    <figure className="relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-holo)]">
      <img
        src={holoxyAsset.url}
        alt="VYOMA HOLOXY tabletop device projecting Draupadi's Vastraharan upward"
        className="aspect-square size-full object-cover"
        fetchPriority="high"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 to-transparent px-5 pb-4 pt-14 text-xs uppercase tracking-[0.25em] text-background">
        VYOMA HOLOXY · Upward projection demonstrator
      </figcaption>
    </figure>
  );
}
