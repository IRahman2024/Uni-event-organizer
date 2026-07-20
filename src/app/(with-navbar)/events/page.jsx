"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  CalendarPlus,
  CalendarRange,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import EventCard, { formatDate } from "@/components/Event/EventCard";
import { Button } from "@/shadcn-components/ui/button";
import { Input } from "@/shadcn-components/ui/input";
import { Badge } from "@/shadcn-components/ui/badge";

const timeframes = ["All", "Upcoming", "Past"];

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [timeframe, setTimeframe] = useState("All");
  const [view, setView] = useState("grid");

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await axios.get("/api/events");
        setEvents(response.data.data || []);
        setError(null);
      } catch (requestError) {
        console.error("Error fetching events:", requestError);
        setError("We could not load events right now.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(events.map((event) => event.eventType).filter(Boolean))).sort(),
    ],
    [events],
  );

  const visibleEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => {
        const haystack = `${event.eventTitle || ""} ${event.description || ""} ${event.location || ""}`.toLowerCase();
        const matchesQuery = haystack.includes(query.trim().toLowerCase());
        const matchesCategory = category === "All" || event.eventType === category;
        const date = new Date(event.eventDate);
        const validDate = !Number.isNaN(date.getTime());
        const matchesTime =
          timeframe === "All" ||
          (timeframe === "Upcoming" ? !validDate || date >= now : validDate && date < now);
        return matchesQuery && matchesCategory && matchesTime;
      })
      .sort((a, b) => new Date(a.eventDate || 0) - new Date(b.eventDate || 0));
  }, [events, query, category, timeframe]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setTimeframe("All");
  };

  return (
    <main className="min-h-screen pb-20">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0d0714] text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_15%,rgba(183,101,255,0.26),transparent_30%),radial-gradient(circle_at_18%_100%,rgba(255,111,97,0.18),transparent_30%)]" />
        <div className="page-shell py-16 sm:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-sm font-semibold text-violet-200 backdrop-blur-xl">
                <Sparkles className="size-3.5" /> Explore campus
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
                Find your next great event.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
                From workshops to cultural nights, discover what is happening, meet your people, and save your seat.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 shrink-0 rounded-xl bg-white px-5 font-semibold text-[#0d0714] shadow-xl hover:-translate-y-0.5 hover:bg-white/90">
              <Link href="/dashboard/admin/Events/create">
                <CalendarPlus className="size-4" /> Create event
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="page-shell pt-8">
        <div className="glass-panel sticky top-20 z-30 rounded-2xl p-3 shadow-lg">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events, venues, or topics"
                className="pl-10"
                aria-label="Search events"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden items-center gap-1.5 px-1 text-xs font-semibold text-muted-foreground sm:flex">
                <SlidersHorizontal className="size-3.5" /> Filter
              </span>
              {timeframes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTimeframe(item)}
                  className={`focus-ring rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                    timeframe === item
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
              <div className="ml-auto flex rounded-xl border bg-background/70 p-1">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`focus-ring rounded-lg p-2 ${view === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                >
                  <Grid2X2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("agenda")}
                  className={`focus-ring rounded-lg p-2 ${view === "agenda" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
                  aria-label="Agenda view"
                  aria-pressed={view === "agenda"}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Event categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-medium capitalize transition-all ${
                category === item
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Discover</p>
            <h2 className="mt-1 text-2xl font-semibold capitalize">{category === "All" ? "All events" : category}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? "Finding events..." : `${visibleEvents.length} ${visibleEvents.length === 1 ? "event" : "events"}`}
            </p>
          </div>
        </div>

        {loading && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
          </div>
        )}

        {!loading && error && (
          <div className="premium-card mt-8 flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <CalendarRange className="size-10 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Events are taking a quick break</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button className="mt-5" onClick={() => window.location.reload()}>Try again</Button>
          </div>
        )}

        {!loading && !error && visibleEvents.length === 0 && (
          <div className="premium-card mt-8 flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Search className="size-6" />
            </span>
            <h2 className="mt-5 text-xl font-semibold">No matching events yet</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Try a broader search or reset the filters to see everything happening on campus.
            </p>
            <Button className="mt-5" variant="outline" onClick={clearFilters}>Clear filters</Button>
          </div>
        )}

        {!loading && !error && visibleEvents.length > 0 && view === "grid" && (
          <div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}

        {!loading && !error && visibleEvents.length > 0 && view === "agenda" && (
          <div className="premium-card mt-6 divide-y overflow-hidden">
            {visibleEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="focus-ring grid gap-3 p-5 transition-colors hover:bg-accent/35 sm:grid-cols-[150px_1fr_auto] sm:items-center"
              >
                <div className="text-sm font-semibold text-primary">{formatDate(event.eventDate)}</div>
                <div>
                  <h3 className="text-lg font-semibold">{event.eventTitle}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{event.location || "Venue TBA"}</p>
                </div>
                <Badge variant="outline" className="capitalize">{event.eventType || "Event"}</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
