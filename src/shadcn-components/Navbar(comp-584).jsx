import { useId } from "react"
import { LogInIcon, SearchIcon } from "lucide-react"

import Logo from "@/shadcn-components/logo"
import NotificationMenu from "@/shadcn-components/notification-menu"
import UserMenu from "@/shadcn-components/user-menu"
import { Button } from "@/shadcn-components/ui/button"
import { Input } from "@/shadcn-components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shadcn-components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn-components/ui/popover"
import ModeToggle from "@/components/ThemeProvider/ModeToggle"
import { stackServerApp } from "@/stack/server"
import { UserButton } from "@stackframe/stack"
import Link from "next/link"
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home", active: true },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
]

export default async function Navbar() {
  const id = useId();

  const user = await stackServerApp.getUser();
  const app = stackServerApp.urls;

  // console.log(user ? 'true' : 'false');
  // console.log('navbar userid: ', id);


  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4 w-full">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-2 md:size-8 md:hidden" variant="ghost" size="icon">
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]" />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45" />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5" active={link.active}>
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center gap-6">
            <a href="/" className="md:size-8 text-primary hover:text-primary/90">
              <Logo />
            </a>
            <p className="text-xs md:text-sm font-black font-sans" style={{ fontFamily: '"Aclonica", sans-serif' }}>A Uni Project</p>
          </div>
        </div>
        {/* Middle area */}
        <div className="grow hidden md:block">
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-xs">
            <Input
              id={id}
              className="peer h-8 ps-8 pe-10"
              placeholder="Search..."
              type="search" />
            <div
              className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <div
              className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
              <kbd
                className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* <ModeToggle></ModeToggle> */}
          <AnimatedThemeToggler></AnimatedThemeToggler>
          {/* Notification */}
          <NotificationMenu />
          {/* User menu */}
          <UserMenu></UserMenu>
          {/* {user ? <UserMenu></UserMenu> : <UserButton></UserButton>} */}
          {/* {user ? <UserButton></UserButton> : <Link href={app?.signIn}>
            <Button variant="outline" className="font-sans">
              <LogInIcon /> Login
            </Button>
          </Link>} */}
        </div>
      </div>
      {/* Bottom navigation */}
      <div className="border-t py-2 max-md:hidden">
        {/* Navigation menu */}
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  active={link.active}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary py-1.5 font-medium">
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
