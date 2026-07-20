import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  Compass,
  Quote,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Hero from "@/components/Hero/hero";
import CarouselServer from "@/components/Carousel/CarouselServer";
import { Features } from "@/components/Features/Features";
import Steps from "@/components/Steps/Steps";
import { Button } from "@/shadcn-components/ui/button";

export const dynamic = "force-dynamic";

const platformFlow = [
  { icon: Compass, title: "Discover", text: "Find what fits your campus life" },
  { icon: CalendarCheck2, title: "Register", text: "Save your seat with confidence" },
  { icon: WandSparkles, title: "Organize", text: "Create an experience people remember" },
];

const quotes = [
  { quote: "I stopped hearing about the best campus events after they happened.", role: "Student attendee" },
  { quote: "Registration and reporting finally live in the same place.", role: "Student organizer" },
  { quote: "The event page tells me exactly what I need before I commit.", role: "Campus community member" },
];

export default function Home() {
  return (
    <main>
      <Hero />

      <section className="border-b border-border/60 bg-card/60" aria-label="Platform overview">
        <div className="page-shell grid divide-y py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {platformFlow.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 px-2 py-5 sm:px-6 lg:px-8">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space page-shell" aria-labelledby="featured-events-title">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow"><Sparkles className="size-3.5" /> Happening now</span>
            <h2 id="featured-events-title" className="mt-5 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Worth leaving class for.</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
              Fresh opportunities to learn, build, perform, compete, and meet your people.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/events">View all events <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 overflow-hidden rounded-[24px] border border-border/70 bg-card/50 shadow-sm">
          <CarouselServer />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border/60 bg-muted/35">
        <div className="pointer-events-none absolute -right-24 top-16 size-96 rounded-full bg-violet-500/[0.06] blur-3xl" aria-hidden="true" />
        <div className="section-space page-shell relative">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="eyebrow">One connected platform</span>
            <h2 className="text-balance mt-5 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Everything a campus event needs.</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Thoughtful tools for discovering, organizing, registering, and measuring impact.
            </p>
          </div>
          <Features />
        </div>
      </section>

      <section className="section-space page-shell">
        <Steps />
      </section>

      <section className="relative overflow-hidden border-y border-border/60 bg-card/45">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,hsl(var(--primary)/.07),transparent_40%)]" aria-hidden="true" />
        <div className="section-space page-shell relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Made for campus life</span>
            <h2 className="mt-5 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Less searching. More showing up.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {quotes.map((item) => (
              <figure key={item.quote} className="premium-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Quote className="size-5" />
                </span>
                <blockquote className="mt-5 text-lg font-medium leading-8">{item.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="size-2 rounded-full bg-primary" /> {item.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="organizers" className="section-space page-shell">
        <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-[#0e0717] p-8 text-white shadow-[0_30px_80px_rgba(28,12,46,0.22)] sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-10 -z-10 size-72 rounded-full bg-[#ff6f61]/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-300">
              <Building2 className="size-4" /> For organizers
            </span>
            <h2 className="text-balance mt-4 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Turn an idea into a full room.</h2>
            <p className="mt-4 text-lg leading-8 text-white/65">
              Create polished event pages, customize registration, manage attendees, and understand your impact from one workspace.
            </p>
          </div>
          <Button asChild size="lg" className="relative mt-8 h-12 shrink-0 rounded-xl bg-white px-6 font-semibold text-[#0e0717] shadow-xl hover:-translate-y-0.5 hover:bg-white/90 lg:mt-0">
            <Link href="/dashboard/admin/Events/create">Create your event <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
