"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { CalendarDays, House, LayoutDashboard, Sparkles, User, Users } from "lucide-react";
import { NavMain } from "@/shadcn-components/nav-main";
import { NavUser } from "@/shadcn-components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail } from "@/shadcn-components/ui/sidebar";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const adminNavigation = [
  { title: "Overview", url: "/dashboard/admin", icon: LayoutDashboard, items: [{ title: "Dashboard", url: "/dashboard/admin" }] },
  { title: "Events", url: "/dashboard/admin/Events", icon: CalendarDays, items: [{ title: "Create event", url: "/dashboard/admin/Events/create" }, { title: "Manage events", url: "/dashboard/admin/Events/delete" }] },
  { title: "Attendees", url: "/dashboard/admin/Students", icon: Users, items: [{ title: "All students", url: "/dashboard/admin/Students" }] },
];

const studentNavigation = [
  { title: "Overview", url: "/dashboard/student", icon: LayoutDashboard, items: [{ title: "Dashboard", url: "/dashboard/student" }] },
  { title: "My events", url: "/dashboard/student/my-events", icon: CalendarDays, items: [{ title: "Registrations", url: "/dashboard/student/my-events" }] },
  { title: "Profile", url: "/dashboard/student/my-profile", icon: User, items: [{ title: "Campus profile", url: "/dashboard/student/my-profile" }] },
];

export function AppSidebar({ role, ...props }) {
  const user = useUser();
  const pathname = usePathname();
  const navigation = (role === "admin" ? adminNavigation : studentNavigation).map((group) => ({ ...group, isActive: pathname.startsWith(group.url) }));
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-2 border-b border-sidebar-border p-3 group-data-[collapsible=icon]:hidden">
        <SidebarMenuButton asChild size="lg" tooltip="AfterClass home" className="hover:bg-sidebar-accent">
          <Link href="/"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><span className="font-[family-name:var(--font-space-grotesk)] text-base font-bold">AfterClass</span></Link>
        </SidebarMenuButton>
        <div className="flex items-center justify-between gap-2 rounded-lg bg-sidebar-accent/70 px-2 py-1.5"><span className="truncate text-xs font-semibold uppercase tracking-wider text-sidebar-accent-foreground">{role} workspace</span><AnimatedThemeToggler /></div>
      </SidebarHeader>
      <SidebarContent className="p-2"><NavMain items={navigation} /></SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
