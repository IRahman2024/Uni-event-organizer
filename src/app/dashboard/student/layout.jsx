"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { SnackbarProvider } from "notistack";
import { AppSidebar } from "@/shadcn-components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shadcn-components/ui/sidebar";
import { isStudent } from "@/lib/roles";

function titleFor(pathname) { if (pathname.includes("my-events")) return "My events"; if (pathname.includes("my-profile")) return "Campus profile"; return "Student dashboard"; }

export default function StudentLayout({ children }) {
  const user = useUser({ or: "redirect" });
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (user && !isStudent(user)) router.replace("/dashboard/admin"); }, [user, router]);
  if (!user || !isStudent(user)) return <div className="grid min-h-screen place-items-center"><div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="size-4 animate-pulse rounded-full bg-primary" /> Preparing your workspace…</div></div>;
  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <SidebarInset className="bg-transparent"><SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }}><header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6"><SidebarTrigger /><div className="h-5 w-px bg-border" /><div><p className="text-xs font-medium text-muted-foreground">Student workspace</p><h1 className="text-sm font-semibold tracking-normal">{titleFor(pathname)}</h1></div></header><div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div></SnackbarProvider></SidebarInset>
    </SidebarProvider>
  );
}
