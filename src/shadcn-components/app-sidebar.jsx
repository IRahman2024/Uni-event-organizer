"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  CalendarDays,
  Users,
  House
} from "lucide-react"


import { NavMain } from "@/shadcn-components/nav-main"
import { NavProjects } from "@/shadcn-components/nav-projects"
import { NavUser } from "@/shadcn-components/nav-user"
import { TeamSwitcher } from "@/shadcn-components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/shadcn-components/ui/sidebar"
import { Button } from "./ui/button"
import Link from "next/link"
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shadcn-components/ui/collapsible"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Event Management",
      url: "#",
      icon: CalendarDays,
      isActive: true,
      items: [
        {
          title: "Create A New Event",
          url: "/dashboard/Events/create",
        },
        {
          title: "Update or Delete Events",
          url: "/dashboard/Events/delete",
        },
      ],
    },
    {
      title: "Participants",
      url: "#",
      icon: Users,
      items: [
        {
          title: "List Of All Participants",
          url: "#",
        },
        // {
        //   title: "Explorer",
        //   url: "#",
        // },
        // {
        //   title: "Quantum",
        //   url: "#",
        // },
      ],
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
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
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <Collapsible asChild
          className="collapsible">
          <CollapsibleTrigger asChild>
            <Link href='/'>
              <SidebarMenuButton className='bg-primary text-foreground flex items-center'>
                {<House /> && <House />}
                <span>Home</span>
              </SidebarMenuButton>
            </Link>
          </CollapsibleTrigger>
        </Collapsible>
        <Collapsible asChild
          className="collapsible">
          <CollapsibleTrigger asChild>
            <AnimatedThemeToggler></AnimatedThemeToggler>
          </CollapsibleTrigger>
        </Collapsible>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
