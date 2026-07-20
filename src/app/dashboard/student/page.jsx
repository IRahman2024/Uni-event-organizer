import Link from "next/link";
import { ArrowRight, CalendarCheck2, Compass, Sparkles, UserRoundCheck } from "lucide-react";
import { Button } from "@/shadcn-components/ui/button";

const actions = [
  { title: "Discover events", description: "See what is happening across campus and find your next experience.", href: "/events", icon: Compass, action: "Explore" },
  { title: "My registrations", description: "Review upcoming events, payment status, and submitted responses.", href: "/dashboard/student/my-events", icon: CalendarCheck2, action: "View events" },
  { title: "Complete your profile", description: "Keep your campus details current for faster event registration.", href: "/dashboard/student/my-profile", icon: UserRoundCheck, action: "Open profile" },
];

export default function StudentDashboard() {
  return <div className="mx-auto max-w-6xl"><div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background sm:p-10"><div className="absolute -right-12 -top-20 size-64 rounded-full bg-primary/35 blur-3xl" /><div className="relative max-w-2xl"><span className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> Your campus, organized</span><h2 className="mt-4 text-4xl font-bold sm:text-5xl">Welcome back to AfterClass.</h2><p className="mt-4 text-lg leading-8 text-background/70">Your events, profile, and next campus discovery are all within reach.</p><Button asChild className="mt-7"><Link href="/events">Find an event <ArrowRight /></Link></Button></div></div><div className="mt-6 grid gap-5 md:grid-cols-3">{actions.map(({ title, description, href, icon: Icon, action }) => <article key={title} className="premium-card flex flex-col p-6"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p><Button asChild variant="ghost" className="mt-5 justify-start px-0 text-primary hover:bg-transparent"><Link href={href}>{action} <ArrowRight /></Link></Button></article>)}</div></div>;
}
