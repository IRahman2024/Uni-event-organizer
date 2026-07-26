"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { AppSidebar } from "@/shadcn-components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shadcn-components/ui/sidebar";
import { isAdmin } from "@/lib/roles";

function titleFor(pathname) {
  if (pathname.includes("/Events/create")) return "Create event";
  if (pathname.includes("/Events/delete")) return "Manage events";
  if (pathname.includes("/Students")) return "Attendees";
  return "Event dashboard";
}

export default function AdminLayout({ children }) {
  const user = useUser({ or: "redirect" });
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (user && !isAdmin(user)) router.replace("/dashboard/student"); }, [user, router]);
  if (!user || !isAdmin(user)) return <div className="grid min-h-screen place-items-center"><div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="size-4 animate-pulse rounded-full bg-primary" /> Preparing your workspace…</div></div>;
  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <SidebarInset className="bg-transparent">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6"><SidebarTrigger /><div className="h-5 w-px bg-border" /><div><p className="text-xs font-medium text-muted-foreground">Organizer workspace</p><h1 className="text-sm font-semibold tracking-normal">{titleFor(pathname)}</h1></div></header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
