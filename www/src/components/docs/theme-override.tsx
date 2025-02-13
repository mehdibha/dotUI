"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useThemes } from "@/hooks/use-themes";

interface ThemeOverrideProps
  extends Omit<React.ComponentProps<"div">, "style"> {
  children?: React.ReactNode;
  fallback?: ReactNode;
  style?: (color: string) => React.CSSProperties;
}

export const ThemeOverride = React.forwardRef<
  HTMLDivElement,
  ThemeOverrideProps
>(({ children, ...props }, ref) => {
  const { currentTheme, mode } = useThemes();

  // colors
  const currentMode = currentTheme.colors[mode];

  const styles = Object.fromEntries(
    (["neutral", "success", "warning", "danger", "accent"] as const).flatMap(
      (color) => {
        const shades = currentMode[color].shades;
        return shades.map((shade, index) => {
          return [`--color-${color}-${(index + 1) * 100}`, shade];
        });
      }
    )
  );

  return (
    <div
      ref={ref}
      {...props}
      data-theme={currentTheme.id}
      style={
        {
          ...styles,
          ...props.style?.(currentMode.neutral.shades[3]),
        } as React.CSSProperties
      }
      className={cn("bg-bg text-fg", props.className)}
    >
      {children}
    </div>
  );
});

ThemeOverride.displayName = "ThemeOverride";
