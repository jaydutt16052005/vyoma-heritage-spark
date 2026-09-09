import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { SEARCH_INDEX } from "@/data/vyoma";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/knowledge-graph", label: "Knowledge Graph" },
  { to: "/heritage", label: "Heritage" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const pool = term
      ? SEARCH_INDEX.filter(
          (i) => i.title.toLowerCase().includes(term) || i.sub.toLowerCase().includes(term) || i.kind.toLowerCase().includes(term),
        )
      : SEARCH_INDEX.slice(0, 8);
    return pool.slice(0, 12);
  }, [q]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative grid size-8 place-items-center rounded-full border border-primary/50">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_14px_var(--gold)]" />
              <span className="absolute inset-0 rounded-full border border-accent/40 animate-spin-slow" />
            </span>
            <span className="font-display text-xl tracking-[0.32em] gold-text">VYOMA</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                activeProps={{ className: "bg-secondary/80 text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search the archive</span>
              <kbd className="hidden rounded bg-secondary px-1.5 py-0.5 text-[10px] tracking-widest sm:inline">⌘K</kbd>
            </button>
            <Link
              to="/scene/$sceneId"
              params={{ sceneId: "vastraharan" }}
              className="hidden items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] sm:flex"
            >
              <Sparkles className="size-4" /> Enter Theatre
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-background/80 px-4 pt-24 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setOpen(false)} />
          <div className="animate-rise relative w-full max-w-xl overflow-hidden rounded-2xl glass shadow-[var(--shadow-elegant)]">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 text-primary" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search epics, scenes, characters, monuments, terms…"
                className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <ul className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing in the archive matches that.</li>
              )}
              {results.map((r, i) => (
                <li key={`${r.title}-${i}`}>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                      navigate({ to: r.to as string, params: r.params as never });
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary/70"
                  >
                    <span className="rounded-md border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                      {r.kind}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{r.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{r.sub}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-xs text-muted-foreground sm:flex-row">
        <p className="font-display tracking-[0.3em] text-primary">VYOMA</p>
        <p>Holographic heritage theatre · prototype with mock data</p>
        <p>Made for classrooms, museums and living rooms.</p>
      </div>
    </footer>
  );
}
