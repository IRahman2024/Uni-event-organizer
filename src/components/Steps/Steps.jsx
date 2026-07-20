"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarSearch,
  Check,
  ClipboardCheck,
  LayoutDashboard,
  Play,
  Sparkles,
  UserRoundCheck,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/shadcn-components/ui/button";

const journeys = {
  student: {
    label: "For students",
    eyebrow: "Student journey",
    title: "Go from new account to confirmed attendee.",
    description: "Watch the real product flow, one short step at a time.",
    cta: "Explore events",
    href: "/events",
    steps: [
      {
        title: "Create your account",
        description: "Sign up securely and enter the campus community in a few moments.",
        video: "/sign-up.mp4",
        icon: UserRoundCheck,
      },
      {
        title: "Complete your profile",
        description: "Add your campus details so event discovery feels relevant to you.",
        video: "/Userprofile.mp4",
        icon: Check,
      },
      {
        title: "Find the right event",
        description: "Search and browse upcoming experiences without losing your place.",
        video: "/searching event.mp4",
        icon: CalendarSearch,
      },
      {
        title: "Register and join",
        description: "Review the details, complete the form, and reserve your place.",
        video: "/Registering-Events.mp4",
        icon: ClipboardCheck,
      },
    ],
  },
  organizer: {
    label: "For organizers",
    eyebrow: "Organizer toolkit",
    title: "Build, manage, and understand every event.",
    description: "See how the organizer workspace turns a plan into measurable impact.",
    cta: "Create an event",
    href: "/dashboard/admin/Events/create",
    steps: [
      {
        title: "Know your dashboard",
        description: "Get a clear overview of events, registrations, and activity.",
        video: "/dashboard.mp4",
        icon: LayoutDashboard,
      },
      {
        title: "Create and manage",
        description: "Publish complete event information and manage the attendee journey.",
        video: "/organizing event.mp4",
        icon: WandSparkles,
      },
      {
        title: "Measure your impact",
        description: "Use performance and participation data to improve the next event.",
        video: "/Impact.mp4",
        icon: BarChart3,
      },
    ],
  },
};

export default function Steps() {
  const [audience, setAudience] = useState("student");
  const [activeStep, setActiveStep] = useState(0);
  const journey = journeys[audience];
  const selected = journey.steps[activeStep];

  const changeAudience = (nextAudience) => {
    setAudience(nextAudience);
    setActiveStep(0);
  };

  return (
    <div id="how-it-works">
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">
          <Play className="size-3.5 fill-current" /> See how it works
        </span>
        <h2 className="text-balance mt-5 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
          Learn the platform by watching it happen.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Short, real product walkthroughs make every important action easy to understand.
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-fit rounded-2xl border bg-card p-1.5 shadow-sm" role="tablist" aria-label="Choose a product guide">
        {Object.entries(journeys).map(([key, item]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={audience === key}
            onClick={() => changeAudience(key)}
            className={`focus-ring rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              audience === key
                ? "bg-foreground text-background shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-start gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">{journey.eyebrow}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">{journey.title}</h3>
          <p className="mt-3 leading-7 text-muted-foreground">{journey.description}</p>

          <div className="mt-7 space-y-3" role="tablist" aria-label={`${journey.label} walkthrough steps`}>
            {journey.steps.map((step, index) => {
              const Icon = step.icon;
              const active = activeStep === index;
              return (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveStep(index)}
                  className={`focus-ring group flex w-full gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-primary/35 bg-primary/[0.06] shadow-md"
                      : "border-border/70 bg-card hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                  }`}
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-[0.14em] text-primary">Step {String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-1 block font-semibold">{step.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">{step.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <Button asChild variant="outline" className="mt-6 rounded-xl">
            <Link href={journey.href}>
              {journey.cta} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0612] p-2.5 shadow-[0_30px_80px_rgba(29,14,48,0.26)] sm:p-3.5">
            <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-violet-500/25 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-slate-950">
              <div className="flex h-11 items-center justify-between border-b border-white/10 bg-white/[0.04] px-4">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#ff6f61]" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="max-w-[60%] truncate rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-medium text-white/50">
                  afterclass / {selected.title.toLowerCase()}
                </span>
                <Sparkles className="size-3.5 text-violet-300" />
              </div>

              <div className="relative aspect-video bg-[#07030f]">
                <video
                  key={selected.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  preload="metadata"
                  className="h-full w-full object-contain"
                  aria-label={`${selected.title} product walkthrough`}
                >
                  <source src={selected.video} type="video/mp4" />
                  Your browser does not support embedded video.
                </video>
              </div>
            </div>

            <div className="relative flex flex-col justify-between gap-3 px-3 pb-2 pt-5 text-white sm:flex-row sm:items-center sm:px-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">Now playing</p>
                <p className="mt-1 font-semibold">{selected.title}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/60">
                {activeStep + 1} of {journey.steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
