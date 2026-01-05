"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";

function Progress({
  className,
  children,
  value = 0,
  max = 100,
  ...props
}) {
  // Calculate the percentage (0 to 100)
  const percentage = Math.round((value / max) * 100);

  // Calculate the "Gap" (remaining capacity)
  const gap = 100 - percentage;

  // Logic for colors
  let statusColor = "bg-primary";
  if (gap > 80) statusColor = "bg-green-500";
  else if (gap < 10) statusColor = "bg-red-500";
  else if (gap < 50) statusColor = "bg-yellow-500";

  return (
    <ProgressPrimitive.Root
      // Pass the actual value and max to the root for accessibility
      value={value}
      max={max}
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {/* We use a context-like pattern or pass props to children */}
      {React.Children.map(children, child => {
        // If child is ProgressTrack, inject the color
        if (child.type === ProgressTrack) {
          return React.cloneElement(child, {
            children: <ProgressIndicator className={statusColor} />
          });
        }
        // If child is the container with ProgressValue, we handle it below
        return child;
      })}
    </ProgressPrimitive.Root>
  );
}

function ProgressLabel({ className, ...props }) {
  return (
    <ProgressPrimitive.Label
      className={cn("font-medium text-sm", className)}
      data-slot="progress-label"
      {...props} />
  );
}

function ProgressTrack({ className, ...props }) {
  return (
    <ProgressPrimitive.Track
      className={cn("block h-1.5 w-full overflow-hidden rounded-full bg-slate-200", className)}
      data-slot="progress-track"
      {...props} />
  );
}

function ProgressIndicator({ className, ...props }) {
  return (
    <ProgressPrimitive.Indicator
      // We removed "bg-primary" from here so the dynamic class can take over
      className={cn("h-full w-full transition-all duration-500", className)}
      data-slot="progress-indicator"
      {...props} />
  );
}

function ProgressValue({ className, ...props }) {
  return (
    <ProgressPrimitive.Value
      className={cn("text-sm tabular-nums", className)}
      data-slot="progress-value"
      {...props} />
  );
}

export {
  Progress,
  ProgressLabel,
  ProgressTrack,
  ProgressIndicator,
  ProgressValue,
};