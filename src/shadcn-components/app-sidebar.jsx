"use client"

import * as React from "react"
import {
  CalendarDays,
  Users,
  House,
  User,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/shadcn-components/nav-main"
import { NavUser } from "@/shadcn-components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/shadcn-components/ui/sidebar"
import Link from "next/link"
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/shadcn-components/ui/collapsible"
import { useUser } from "@stackframe/stack"

const adminNavigation = [
  {
    title: "Event Management",
    url: "#",
    icon: CalendarDays,
    isActive: true,
    items: [
      {
        title: "Create A New Event",
        url: "/dashboard/admin/Events/create",
      },
      {
        title: "Update or Delete Events",
        url: "/dashboard/admin/Events/delete",
      },
    ],
  },
  {
    title: "Students",
    url: "#",
    icon: Users,
    items: [
      {
        title: "List Of All Students",
        url: "/dashboard/admin/Students",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Limits",
        url: "#",
      },
    ],
  },
];

const studentNavigation = [
  {
    title: "Event Management",
    url: "/dashboard/student/my-profile",
    icon: CalendarDays,
    isActive: true,
    items: [
      {
        title: "My Events",
        url: "/dashboard/student/my-events",
      }
    ],
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
    items: [
      {
        title: "My Profile",
        url: "/dashboard/student/my-profile",
      }
    ],
  },
];

export function AppSidebar({ role, ...props }) {
  const user = useUser();

  const navigation = role === 'admin' ? adminNavigation : studentNavigation;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Collapsible asChild className="collapsible">
          <CollapsibleTrigger asChild>
            <Link href='/'>
              <SidebarMenuButton className='bg-primary text-foreground flex items-center'>
                <House />
                <span>Home</span>
              </SidebarMenuButton>
            </Link>
          </CollapsibleTrigger>
        </Collapsible>
        <Collapsible asChild className="collapsible">
          <CollapsibleTrigger asChild>
            <AnimatedThemeToggler />
          </CollapsibleTrigger>
        </Collapsible>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}