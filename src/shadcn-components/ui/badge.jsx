import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-xs leading-none font-semibold whitespace-nowrap focus-visible:ring-[3px] focus-visible:ring-ring/50", {
  variants: { variant: {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    green: "border-emerald-600/15 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    yellow: "border-amber-600/15 bg-amber-500/12 text-amber-700 dark:text-amber-300",
    blue: "border-sky-600/15 bg-sky-500/12 text-sky-700 dark:text-sky-300",
    destructive: "border-transparent bg-destructive text-white",
    outline: "border-border bg-background/60 text-foreground",
  } }, defaultVariants: { variant: "default" }
});

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
