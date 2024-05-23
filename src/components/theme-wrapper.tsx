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
          ...theme[resolvedMode],
          "--radius": `${theme.radius}rem`,
        } as React.CSSProperties
      }
      className="text-fg"
    >
      {children}
    </div>
  );
}
