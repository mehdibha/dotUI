"use client";

import React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/classes";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <SwitchPrimitives.Root
      checked={theme === "dark"}
      onCheckedChange={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        "h-7 w-12",
        className
      )}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          "flex items-center justify-center"
        )}
      >
        <SunIcon size={18} className="block text-muted-foreground dark:hidden" />
        <MoonIcon size={18} className="hidden text-muted-foreground dark:block" />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
};
