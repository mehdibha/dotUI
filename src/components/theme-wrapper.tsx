"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { useMounted } from "@/lib/hooks/use-mounted";

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function ThemeWrapper(props: ThemeWrapperProps) {
  const { children, fallback } = props;
  const { type, mode, theme } = useConfig();
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();
  const rootMode = resolvedTheme as "light" | "dark";
  const resolvedMode = type === "default" ? rootMode : mode;

  if (!mounted) {
    return fallback;
  }

  return (
    <div
      style={
        {
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
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
