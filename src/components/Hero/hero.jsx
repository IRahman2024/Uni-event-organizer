"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Compass,
  Sparkles,
  Users,
} from "lucide-react";
import LaserFlow from "@/shadcn-components/LaserFlow";
import { Button } from "@/shadcn-components/ui/button";

const benefits = [
  { icon: CalendarCheck2, label: "Fast registration" },
  { icon: Users, label: "People-first communities" },
  { icon: Compass, label: "One place for campus life" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#07030f] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <LaserFlow
          color="#B765FF"
          fogIntensity={0.7}
          fogScale={0.32}
          wispDensity={1}
          wispIntensity={4.8}
          wispSpeed={14}
          flowSpeed={0.32}
          flowStrength={0.25}
          verticalSizing={2.9}
          horizontalSizing={1.32}
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0}
          decay={2.15}
          falloffStart={1.48}
          fogFallSpeed={0.86}
          mouseTiltStrength={0.009}
          className="opacity-95"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(192,108,255,0.18),transparent_30%),radial-gradient(circle_at_15%_85%,rgba(255,111,97,0.12),transparent_34%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#07030f] via-[#07030f]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#07030f] via-[#07030f]/78 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#07030f]/85 to-transparent" />
      </div>

      <div className="page-shell relative z-10 grid min-h-[720px] items-center gap-14 py-24 lg:grid-cols-[1.04fr_.96fr] lg:gap-20 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-violet-100 shadow-[0_12px_40px_rgba(139,62,225,0.16)] backdrop-blur-xl">
            <Sparkles className="size-4 text-violet-300" />
            Welcome to campus life
          </div>

          <h1 className="mt-7 max-w-3xl text-balance text-5xl font-bold leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-[5.4rem]">
            Your campus events <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-violet-400">hub.</span>
          </h1>

          <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-[#ff776b] to-[#b765ff] shadow-[0_0_24px_rgba(183,101,255,0.7)]" />

          <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-white/70 sm:text-xl">
            Discover events that spark your interests, meet people who share your energy, and turn ordinary campus days into lasting memories.
          </p>
        </div>

        <div className="relative lg:pl-4">
          <div className="absolute -inset-10 -z-10 rounded-full bg-violet-500/15 blur-3xl" aria-hidden="true" />
          <div className="rounded-[28px] border border-white/12 bg-[#12081f]/55 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">Ready to dive in?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Find your next great moment.</h2>
            <p className="mt-4 text-base leading-7 text-white/68 sm:text-lg">
              From study groups to concerts, workshops to competitions - see what is happening and never miss out again.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-xl bg-gradient-to-r from-[#ff6f61] to-[#c660f4] px-6 text-base font-semibold text-white shadow-[0_14px_35px_rgba(196,96,244,0.28)] transition-all hover:-translate-y-0.5 hover:brightness-110">
                <Link href="/events">
                  Explore events <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-xl border-white/25 bg-white/[0.06] px-6 text-base font-semibold text-white hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/12 hover:text-white">
                <Link href="/dashboard/admin/Events/create">Create an event</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
              {benefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-medium text-white/65">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-400/12 text-violet-300">
                    <Icon className="size-4" />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-5 -right-3 hidden items-center gap-2 rounded-full border border-white/12 bg-[#0c0614]/80 px-4 py-2.5 text-sm font-medium text-white/72 shadow-2xl backdrop-blur-xl sm:flex">
            <CheckCircle2 className="size-4 text-emerald-400" />
            Built for every campus community
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-400/55 to-transparent" />
    </section>
  );
}
