import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogInIcon,
  LogOutIcon,
  PanelsTopLeftIcon,
  PinIcon,
  UserPenIcon,
  UserPlus,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn-components/ui/avatar"
import { Button } from "@/shadcn-components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn-components/ui/dropdown-menu"
import { AccountSettings, useUser } from "@stackframe/stack"
import { stackServerApp } from "@/stack/server"
import Link from "next/link"

export default async function UserMenu() {
  const user = await stackServerApp.getUser();
  const app = stackServerApp.urls;

  console.log(user);

  const userName = user?.displayName?.charAt(0)?.toUpperCase() || user?.primaryEmail?.charAt(0)?.toUpperCase() || 'User';
  console.log('first character: ', userName);
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-base">
          <Avatar>
            <AvatarImage className='rounded-full' src={user?.profileImageUrl || "./avatar.png"} alt="Profile image" />
            <AvatarFallback className='bg-cyan-400 text-black font-bold text-2xl'>{userName || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      {
        user && <DropdownMenuContent className="max-w-64" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {user?.displayName || 'Name Missing !'}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user?.primaryEmail}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/dashboard" className="flex gap-2">
                <PanelsTopLeftIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Dashboard</span>

              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
              <span>Option 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Option 3</span>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem>
              <PinIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Option 4</span>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Link className="flex gap-2 items-center" href="/MyAccountSettings">
                <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link className="flex gap-2 items-center" href={app?.signOut}>
              <LogOutIcon /> Logout
              {/* <Button variant="ghost" className="font-sans">
            </Button> */}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      }
      {
        !user && <DropdownMenuContent className="max-w-64" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link className="flex items-center gap-2" href='/SignIn'>
                <LogInIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Sign In</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="flex items-center gap-2" href='/SignUp'>
                <UserPlus size={16} className="opacity-60" aria-hidden="true" />
                <span>Sign Up</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      }
    </DropdownMenu>
  );
}
