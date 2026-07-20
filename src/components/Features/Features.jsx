import { BarChart3, BellRing, CalendarPlus2, CreditCard, Search, ShieldCheck, TicketCheck, Users2 } from "lucide-react";

const features = [
  { title: "Curated discovery", description: "Search by category, date, venue, and what matters to you.", icon: Search },
  { title: "Quick registration", description: "Join an event through a clear, guided registration flow.", icon: TicketCheck },
  { title: "Powerful event creation", description: "Publish polished event pages with custom registration fields.", icon: CalendarPlus2 },
  { title: "Live insights", description: "Understand registrations, revenue, departments, and event performance.", icon: BarChart3 },
  { title: "Attendee management", description: "Keep student profiles, responses, and participation organized.", icon: Users2 },
  { title: "Smart reminders", description: "Keep attendees informed before, during, and after every event.", icon: BellRing },
  { title: "Secure payments", description: "Handle paid registrations with clear, trustworthy status updates.", icon: CreditCard },
  { title: "Role-aware access", description: "Give students and organizers the right tools for their work.", icon: ShieldCheck },
];

export function Features() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {features.map(({ title, description, icon: Icon }) => (
        <article key={title} className="premium-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105"><Icon className="size-5" /></span>
          <h3 className="mt-5 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </article>
      ))}
    </div>
  );
}
