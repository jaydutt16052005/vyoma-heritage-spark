import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Clock, Users } from "lucide-react";
import { findEpic, VASTRAHARAN } from "@/data/vyoma";

export const Route = createFileRoute("/epics/$epicId")({
  loader: ({ params }) => {
    const epic = findEpic(params.epicId);
    if (!epic) throw notFound();
    return { epic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Archive not found — VYOMA" }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.epic.title} — VYOMA Archive`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.epic.blurb },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.epic.blurb },
      ],
    };
  },
  component: EpicPage,
});

function EpicPage() {
  const { epic } = Route.useLoaderData();
  const showCast = epic.id === "mahabharata";

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 aurora-bg opacity-70" />
        <div className="pointer-events-none absolute inset-0 holo-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 py-20">
          <Link to="/explore" className="text-xs uppercase tracking-[0.3em] text-accent hover:underline">
            ← Explore heritage
          </Link>
          <h1 className="mt-5 text-6xl">{epic.title}</h1>
          <p className="mt-2 font-display text-3xl text-primary/80">{epic.sanskritTitle}</p>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{epic.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-8 text-sm">
            <span className="text-muted-foreground">
              <span className="block text-xs uppercase tracking-widest text-accent">Era</span>
              {epic.era}
            </span>
            <span className="text-muted-foreground">
              <span className="block text-xs uppercase tracking-widest text-accent">Extent</span>
              {epic.verses}
            </span>
            <span className="text-muted-foreground">
              <span className="block text-xs uppercase tracking-widest text-accent">Scenes</span>
              {epic.scenes.length} prepared
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <h2 className="text-3xl">Scenes</h2>
        <div className="mt-6 grid gap-4">
          {epic.scenes.map((s) => (
            <div
              key={s.id}
              className={`flex flex-wrap items-center gap-6 rounded-2xl border p-6 ${
                s.ready ? "card-lift border-primary/40 glass" : "border-border bg-card/40 opacity-70"
              }`}
            >
              <div className="min-w-64 flex-1">
                <p className="text-xs uppercase tracking-[0.25em]" style={{ color: epic.accent }}>
                  {s.parva}
                </p>
                <h3 className="mt-2 text-2xl">{s.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{s.blurb}</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> {s.duration}s
              </span>
              {s.ready ? (
                <Link
                  to="/scene/$sceneId"
                  params={{ sceneId: s.id }}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  Enter scene <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <span className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground">In production</span>
              )}
            </div>
          ))}
        </div>

        {showCast && (
          <div className="mt-16">
            <h2 className="flex items-center gap-3 text-3xl">
              <Users className="size-6 text-accent" /> Principal cast
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VASTRAHARAN.characters.map((ch) => (
                <div key={ch.id} className="card-lift rounded-2xl border border-border glass p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-10 place-items-center rounded-full font-display text-lg"
                      style={{ background: `color-mix(in oklab, ${ch.color} 25%, transparent)`, color: ch.color }}
                    >
                      {ch.name[0]}
                    </span>
                    <div>
                      <p className="text-lg">{ch.name}</p>
                      <p className="text-xs text-muted-foreground">{ch.epithet}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{ch.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
