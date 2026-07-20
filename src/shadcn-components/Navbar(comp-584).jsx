import { Menu, Sparkles, CalendarPlus } from "lucide-react";
import Link from "next/link";
import Searchbar from "@/components/Searchbar/Searchbar";
import NavLinks from "@/components/Navigation/NavLinks";
import UserMenu from "@/shadcn-components/user-menu";
import { AnimatedThemeToggler } from "@/shadcn-components/ui/animated-theme-toggler";
import { Button } from "@/shadcn-components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn-components/ui/popover";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/78 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="page-shell flex h-17 items-center gap-3">
        <div className="md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 rounded-2xl p-2 md:hidden">
              <NavLinks mobile />
              <div className="mt-2 border-t p-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard/admin/Events/create"><CalendarPlus /> Create event</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Link href="/" className="focus-ring flex shrink-0 items-center gap-2 rounded-lg" aria-label="AfterClass home">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4.5" />
          </span>
          <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-[-0.04em]">AfterClass</span>
        </Link>

        <div className="ml-4 hidden lg:block">
          <NavLinks />
        </div>

        <div className="ml-auto hidden w-full max-w-xs md:block lg:ml-6">
          <Searchbar />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-2">
          <Button asChild variant="outline" className="hidden xl:inline-flex">
            <Link href="/dashboard/admin/Events/create"><CalendarPlus /> Create event</Link>
          </Button>
          <AnimatedThemeToggler />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
