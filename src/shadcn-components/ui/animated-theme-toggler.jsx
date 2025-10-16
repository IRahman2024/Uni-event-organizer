"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export const AnimatedThemeToggler = React.forwardRef(
  ({ className, duration = 300, onClick, ...props }, ref) => {
    const [isDark, setIsDark] = useState(false);
    const localButtonRef = useRef(null);
    const mergedRef = useCallback(
      (node) => {
        localButtonRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    useEffect(() => {
      const updateTheme = () => {
        setIsDark(document.documentElement.classList.contains("dark"));
      };

      updateTheme();

      const observer = new MutationObserver(updateTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    const toggleTheme = useCallback(async () => {
      if (!localButtonRef.current) return;

      await document.startViewTransition(() => {
        flushSync(() => {
          const newTheme = !isDark;
          setIsDark(newTheme);
          document.documentElement.classList.toggle("dark");
          localStorage.setItem("theme", newTheme ? "dark" : "light");
        });
      }).ready;

      const { top, left, width, height } =
        localButtonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );

      // Call any onClick passed from parent (important for CollapsibleTrigger)
      if (onClick) onClick();
    }, [isDark, duration, onClick]);

    return (
      <Button
        ref={mergedRef}
        variant="outline"
        onClick={toggleTheme}
        className={cn(className)}
        {...props}
      >
        {isDark ? <Sun /> : <Moon />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
);

AnimatedThemeToggler.displayName = "AnimatedThemeToggler";
