import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { Badge } from "@/shadcn-components/ui/badge";

function eventStatus(event) {
  if (event?.status && event.status !== "active") return event.status;
  if (!event?.eventDate) return "Upcoming";
  const date = new Date(event.eventDate);
  const now = new Date();
  if (Number.isNaN(date.getTime())) return "Upcoming";
  return date < now ? "Past" : "Upcoming";
}

function statusVariant(status) {
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "live") return "green";
  if (["past", "closed", "cancelled"].includes(normalized)) return "secondary";
  return "blue";
}

function getDateParts(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { month: "TBA", day: "--" };
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date),
  };
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function EventCard({ event }) {
  const status = eventStatus(event);
  const price = Number(event?.price || 0);
  const capacity = Math.max(Number(event?.capacity || 0), 0);
  const audience = Math.max(Number(event?.audience || 0), 0);
  const seatsLeft = Math.max(capacity - audience, 0);
  const fill = capacity > 0 ? Math.min((audience / capacity) * 100, 100) : 0;
  const date = getDateParts(event?.eventDate);
  const title = event?.eventTitle || "Untitled event";

  return (
    <article className="premium-card group relative flex h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_55px_rgba(33,23,53,0.14)]">
      <Link
        href={`/events/${event.id}`}
        className="focus-ring flex min-h-full w-full flex-col rounded-2xl"
        aria-label={`View ${title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {event.eventImage ? (
            <img
              src={event.eventImage}
              alt={`${title} event cover`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_75%_15%,hsl(var(--primary)/.28),transparent_35%),linear-gradient(135deg,hsl(var(--primary)/.18),hsl(var(--accent)),hsl(var(--muted)))]">
              <CalendarDays className="size-11 text-primary/75" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/5 to-slate-950/10" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3.5">
            <Badge variant={statusVariant(status)} className="shadow-sm backdrop-blur-md">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current" />
              {status}
            </Badge>
            {event.eventType && (
              <Badge className="max-w-44 truncate border-white/20 bg-white/90 capitalize text-slate-900 shadow-sm backdrop-blur-md">
                {event.eventType}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-3.5 left-3.5 grid min-w-16 place-items-center rounded-2xl border border-white/20 bg-white/92 px-3 py-2 text-center text-slate-950 shadow-lg backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{date.month}</span>
            <span className="text-xl font-bold leading-none">{date.day}</span>
          </div>

          <span className="absolute bottom-3.5 right-3.5 grid size-10 place-items-center rounded-full border border-white/20 bg-white/92 text-slate-900 shadow-lg transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="size-4" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarDays className="size-4" />
            {formatDate(event.eventDate)}
          </p>

          <h2 className="mt-3 line-clamp-2 text-xl font-semibold leading-tight tracking-[-0.015em] transition-colors group-hover:text-primary">
            {title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {event.description || "Open the event to see the full schedule and registration details."}
          </p>

          <div className="mt-auto pt-5">
            <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-sm">
              <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{event.location || "Venue TBA"}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 font-semibold">
                <Ticket className="size-4 text-primary" />
                {price > 0 ? `BDT ${price.toLocaleString()}` : "Free"}
              </span>
            </div>

            {capacity > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {audience.toLocaleString()} joined
                  </span>
                  <span className="font-medium text-foreground/75">
                    {seatsLeft > 0 ? `${seatsLeft.toLocaleString()} seats left` : "Fully booked"}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-[width] duration-500"
                    style={{ width: `${fill}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export { eventStatus, formatDate };
