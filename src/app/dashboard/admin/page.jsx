"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarRange,
  Filter,
  LayoutDashboard,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shadcn-components/ui/button";
import { Card, CardContent } from "@/shadcn-components/ui/card";
import EventTypeChart from "@/components/Charts/EventTypeChart";
import DepartmentChart from "@/components/Charts/DepartmentChart";
import KPICards from "@/components/Charts/KpiCards";
import RevenueTrendChart from "@/components/Charts/RevenueTrendChart";
import EventsPerformanceTable from "@/components/Charts/EventsPerformanceTable";

const defaultFilters = {
  startDate: null,
  endDate: null,
  eventType: null,
  department: null,
};

const fieldClassName =
  "h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10";

export default function DashboardPage() {
  const [filters, setFilters] = useState(defaultFilters);

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value || null }));
  };

  const resetFilters = () => setFilters(defaultFilters);
  const activeFilters = Object.values(filters).filter(Boolean).length;
  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-7 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#100819] px-6 py-8 text-white shadow-[0_28px_70px_rgba(25,11,42,0.2)] sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(183,101,255,0.3),transparent_32%),radial-gradient(circle_at_8%_100%,rgba(255,111,97,0.2),transparent_30%)]" />
        <div className="pointer-events-none absolute -right-20 -top-32 -z-10 size-80 rounded-full border border-white/10" />
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200 backdrop-blur-xl">
              <Sparkles className="size-3.5" /> Live organizer workspace
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Your events, clearly in view.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Follow registrations, revenue, capacity, and event performance from one focused dashboard.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/65">
              <span className="flex items-center gap-2">
                <LayoutDashboard className="size-4 text-violet-300" /> Analytics overview
              </span>
              <span className="flex items-center gap-2">
                <CalendarRange className="size-4 text-[#ff8d82]" /> {currentMonth}
              </span>
            </div>
          </div>

          <Button asChild size="lg" className="h-12 shrink-0 rounded-xl bg-white px-5 font-semibold text-[#100819] shadow-xl hover:-translate-y-0.5 hover:bg-white/90">
            <Link href="/dashboard/admin/Events/create">
              <Plus className="size-4" /> Create event
            </Link>
          </Button>
        </div>
      </section>

      <KPICards filters={filters} />

      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Filter className="size-4" />
                </span>
                <div>
                  <h2 className="font-semibold">Refine your view</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeFilters ? `${activeFilters} filter${activeFilters > 1 ? "s" : ""} active` : "Showing all available event data"}
                  </p>
                </div>
              </div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={resetFilters} disabled={!activeFilters} className="self-start rounded-lg sm:self-auto">
              <RotateCcw className="size-4" /> Reset filters
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="dashboard-start-date" className="text-sm font-medium">Start date</label>
              <input
                id="dashboard-start-date"
                type="date"
                value={filters.startDate || ""}
                onChange={(event) => handleFilterChange("startDate", event.target.value)}
                className={fieldClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dashboard-end-date" className="text-sm font-medium">End date</label>
              <input
                id="dashboard-end-date"
                type="date"
                value={filters.endDate || ""}
                onChange={(event) => handleFilterChange("endDate", event.target.value)}
                className={fieldClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dashboard-event-type" className="text-sm font-medium">Event type</label>
              <select
                id="dashboard-event-type"
                value={filters.eventType || ""}
                onChange={(event) => handleFilterChange("eventType", event.target.value)}
                className={fieldClassName}
              >
                <option value="">All types</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="meetup">Meetup</option>
                <option value="contests and competition">Contests and competition</option>
                <option value="hackathon">Hackathon</option>
                <option value="tech fests">Tech fests</option>
                <option value="cultural">Cultural</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="dashboard-department" className="text-sm font-medium">Department</label>
              <select
                id="dashboard-department"
                value={filters.department || ""}
                onChange={(event) => handleFilterChange("department", event.target.value)}
                className={fieldClassName}
              >
                <option value="">All departments</option>
                <option value="CSE">CSE</option>
                <option value="CE">CE</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Performance</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">What is moving your community</h2>
        </div>

        <EventTypeChart filters={filters} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DepartmentChart filters={filters} />
          <RevenueTrendChart filters={filters} />
        </div>

        <EventsPerformanceTable filters={filters} />
      </section>
    </main>
  );
}
