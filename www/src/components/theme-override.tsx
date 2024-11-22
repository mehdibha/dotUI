"use client";

import React, { ReactNode } from "react";
import { googleFonts } from "@/lib/fonts";
import { useThemes } from "@/hooks/use-themes";
import { useMounted } from "@/registry/hooks/use-mounted";
import { Skeleton } from "@/registry/ui/default/core/skeleton";
import { cn } from "@/registry/ui/default/lib/cn";

interface ThemeOverrideProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  fallback?: ReactNode;
}

export const ThemeOverride = React.forwardRef<
  HTMLDivElement,
  ThemeOverrideProps
>(({ children, fallback, ...props }, ref) => {
  const { currentTheme, mode, fonts } = useThemes();
  const headingFont = googleFonts.find((f) => f.id === fonts.heading);
  const bodyFont = googleFonts.find((f) => f.id === fonts.body);
  const mounted = useMounted();

  // fonts
  React.useEffect(() => {
    if (headingFont) {
      const head = document.head;
      const existingLink = head.querySelector("#heading-font");
      if (existingLink) {
        existingLink.remove();
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = headingFont.url;
      link.id = "heading-font";
      head.appendChild(link);
    }
  }, [headingFont]);

  // colors
  const currentMode = currentTheme.colors[mode];

  const styles = Object.fromEntries(
    (["neutral", "success", "warning", "danger", "accent"] as const).flatMap(
      (color) => {
        const shades = currentMode[color].shades;
        return shades.map((shade, index) => {
          const [h, s, l] = shade.match(/\d+(\.\d+)?/g) || [];
          return [`--color-${color}-${(index + 1) * 100}`, shade];
        });
      }
    )
  );

  if (fallback && !mounted) {
    return fallback;
  }

  return (
    <div
      ref={ref}
      {...props}
      style={
        {
          ...(mounted ? styles : {}),
          ...baseCssVars,
          "--font-heading": headingFont?.name,
          "--font-body": bodyFont?.name,
          "--radius": `${currentTheme.radius}rem`,
        } as React.CSSProperties
      }
      className={cn("bg-bg text-fg font-body", props.className)}
    >
      <Skeleton show={!mounted} className="rounded-none">
        {children}
      </Skeleton>
    </div>
  );
});

ThemeOverride.displayName = "ThemeOverride";

const baseCssVars = {
  "--color-bg": "var(--color-neutral-100)",
  "--color-bg-muted": "var(--color-neutral-200)",
  "--color-bg-inverse": "var(--color-neutral-1000)",
  "--color-bg-disabled": "var(--color-neutral-200)",
  "--color-bg-tooltip": "var(--color-neutral-300)",
  "--color-bg-overlay": "var(--color-neutral-200)",

  "--color-bg-neutral": "var(--color-neutral-300)",
  "--color-bg-neutral-hover": "var(--color-neutral-400)",
  "--color-bg-neutral-active": "var(--color-neutral-500)",

  "--color-bg-primary": "var(--color-neutral-1000)",
  "--color-bg-primary-hover": "var(--color-neutral-900)",
  "--color-bg-primary-active": "var(--color-neutral-800)",

  "--color-bg-success": "var(--color-success-500)",
  "--color-bg-success-hover": "var(--color-success-600)",
  "--color-bg-success-active": "var(--color-success-700)",
  "--color-bg-success-muted": "var(--color-success-200)",
  "--color-bg-success-muted-hover": "var(--color-success-300)",
  "--color-bg-success-muted-active": "var(--color-success-300)",

  "--color-bg-danger": "var(--color-danger-500)",
  "--color-bg-danger-hover": "var(--color-danger-600)",
  "--color-bg-danger-active": "var(--color-danger-700)",
  "--color-bg-danger-muted": "var(--color-danger-100)",
  "--color-bg-danger-muted-hover": "var(--color-danger-300)",
  "--color-bg-danger-muted-active": "var(--color-danger-300)",

  "--color-bg-warning": "var(--color-warning-500)",
  "--color-bg-warning-hover": "var(--color-warning-600)",
  "--color-bg-warning-active": "var(--color-warning-700)",
  "--color-bg-warning-muted": "var(--color-warning-100)",
  "--color-bg-warning-muted-hover": "var(--color-warning-300)",
  "--color-bg-warning-muted-active": "var(--color-warning-300)",

  "--color-bg-accent": "var(--color-accent-500)",
  "--color-bg-accent-hover": "var(--color-accent-600)",
  "--color-bg-accent-active": "var(--color-accent-700)",
  "--color-bg-accent-muted": "var(--color-accent-200)",
  "--color-bg-accent-muted-hover": "var(--color-accent-300)",
  "--color-bg-accent-muted-active": "var(--color-accent-300)",

  "--color-fg": "var(--color-neutral-1000)",
  "--color-fg-muted": "var(--color-neutral-800)",
  "--color-fg-inverse": "var(--color-neutral-100)",
  "--color-fg-disabled": "var(--color-neutral-500)",

  "--color-fg-danger": "var(--color-danger-700)",
  "--color-fg-warning": "var(--color-warning-600)",
  "--color-fg-success": "var(--color-success-700)",
  "--color-fg-accent": "var(--color-accent-700)",

  "--color-fg-link": "var(--color-neutral-1000)",
  "--color-fg-link-hover": "var(--color-neutral-1000)",
  "--color-fg-link-active": "var(--color-neutral-1000)",
  "--color-fg-link-visited": "var(--color-neutral-1000)",

  "--color-fg-onAccent": "var(--color-neutral-1000)",
  "--color-fg-onNeutral": "var(--color-neutral-1000)",
  "--color-fg-onPrimary": "var(--color-neutral-100)",
  "--color-fg-onSuccess": "var(--color-neutral-1000)",
  "--color-fg-onMutedSuccess": "var(--color-neutral-1000)",
  "--color-fg-onDanger": "var(--color-neutral-1000)",
  "--color-fg-onMutedDanger": "var(--color-neutral-1000)",
  "--color-fg-onWarning": "var(--color-neutral-1000)",
  "--color-fg-onMutedWarning": "var(--color-neutral-1000)",

  "--color-fg-onTooltip": "var(--color-neutral-1000)",

  "--color-border": "var(--color-neutral-300)",
  "--color-border-field": "var(--color-neutral-400)",
  "--color-border-control": "var(--color-neutral-700)",
  "--color-border-hover": "var(--color-neutral-1000)",
  "--color-border-active": "var(--color-neutral-500)",
  "--color-border-disabled": "var(--color-neutral-300)",

  "--color-border-success": "var(--color-success-300)",
  "--color-border-danger": "var(--color-danger-300)",
  "--color-border-warning": "var(--color-warning-200)",

  "--color-border-accent": "var(--color-accent-500)",
  "--color-border-secondary": "var(--color-neutral-200)",
  "--color-border-focus": "var(--color-accent-500)",
  "--color-border-inverse": "var(--color-neutral-500)",
};
