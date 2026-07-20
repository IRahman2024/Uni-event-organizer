"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Explore events" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#organizers", label: "For organizers" },
];

export default function NavLinks({ mobile = false, onNavigate }) {
  const pathname = usePathname();

  return (
    <nav aria-label={mobile ? "Mobile navigation" : "Primary navigation"} className={cn(mobile ? "flex flex-col gap-1" : "flex items-center gap-1")}>
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : link.href === "/events" && pathname.startsWith("/events");
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              mobile && "w-full px-3 py-3"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
