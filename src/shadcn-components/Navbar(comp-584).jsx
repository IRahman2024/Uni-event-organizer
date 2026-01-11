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
  { href: "/events", label: "Events" },
  // { href: "#", label: "Profile" },
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
            <a href="/" className="md:size-10 text-primary hover:text-primary/90">
              {/* <Logo /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className='text-black dark:text-white'
                fill="currentColor" // This is the magic part
              >
                <path d="M482.4 221.9C517.7 213.6 544 181.9 544 144C544 99.8 508.2 64 464 64C420.6 64 385.3 98.5 384 141.5L200.2 215.1C185.7 200.8 165.9 192 144 192C99.8 192 64 227.8 64 272C64 316.2 99.8 352 144 352C156.2 352 167.8 349.3 178.1 344.4L323.7 471.8C321.3 479.4 320 487.6 320 496C320 540.2 355.8 576 400 576C444.2 576 480 540.2 480 496C480 468.3 466 443.9 444.6 429.6L482.4 221.9zM220.3 296.2C222.5 289.3 223.8 282 224 274.5L407.8 201C411.4 204.5 415.2 207.7 419.4 210.5L381.6 418.1C376.1 419.4 370.8 421.2 365.8 423.6L220.3 296.2z" />
              </svg>
            </a>
            <p className="text-xs md:text-sm font-black font-sans" style={{ fontFamily: '"Aclonica", sans-serif' }}>AfterClass </p>
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
          {/* <NotificationMenu /> */}
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
