"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils/classes";

interface ThemeOverrideProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export function ThemeOverride(props: ThemeOverrideProps) {
  const { children } = props;
  const { type, mode, theme } = useConfig();
  const mounted = useMounted();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const rootMode = resolvedTheme as "light" | "dark";
  const resolvedMode = type === "default" ? rootMode : mode;

  const shouldOverride = !!(mounted && pathname === "/themes" && theme);
  const debouncedShouldOverride = useDebounce(shouldOverride, 700);
  const styles = (
    shouldOverride && debouncedShouldOverride
      ? {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          "--background": theme[resolvedMode].background,
          "--foreground": theme[resolvedMode].foreground,
          "--card": theme[resolvedMode].card,
          "--card-foreground": theme[resolvedMode]["card-foreground"],
          "--popover": theme[resolvedMode].popover,
          "--popover-foreground": theme[resolvedMode]["popover-foreground"],
          "--primary": theme[resolvedMode].primary,
          "--primary-foreground": theme[resolvedMode]["primary-foreground"],
          "--secondary": theme[resolvedMode].secondary,
          "--secondary-foreground": theme[resolvedMode]["secondary-foreground"],
          "--muted": theme[resolvedMode].muted,
          "--muted-foreground": theme[resolvedMode]["muted-foreground"],
          "--accent": theme[resolvedMode].accent,
          "--accent-foreground": theme[resolvedMode]["accent-foreground"],
          "--destructive": theme[resolvedMode].destructive,
          "--destructive-foreground": theme[resolvedMode]["destructive-foreground"],
          "--border": theme[resolvedMode].border,
          "--input": theme[resolvedMode].input,
          "--ring": theme[resolvedMode].ring,
          "--radius": `${theme.radius}rem`,
        }
      : { background: "hsl(var(--background))", color: "hsl(var(--foreground))" }
  ) as React.CSSProperties | undefined;

  return (
    <div
      className={cn("", shouldOverride ? "duration-1000" : "duration-300")}
      style={styles}
    >
      {children}
    </div>
  );
}
