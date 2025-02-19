"use client";

import React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { usePreviewMode } from "@/components/mode-provider";
import { PrimitivesProvider } from "@/modules/themes/contexts/primitives-context";
import { VariantsProvider } from "@/modules/themes/contexts/variants-context";
import { createThemeCssVars } from "@/modules/themes/lib/create-theme";
import type { Theme } from "@/modules/themes/types";
import { FontLoader } from "./font-loader";

export interface ThemeProviderProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  children?:
    | React.ReactNode
    | ((mode: "light" | "dark" | null) => React.ReactNode);
  theme?: Theme;
  unstyled?: boolean;
  ignorePreviewMode?: boolean;
}
export const ThemeProvider = ({
  theme,
  children,
  className,
  style,
  unstyled = false,
  ignorePreviewMode = false,
  ...props
}: ThemeProviderProps) => {
  const { resolvedTheme } = useTheme();
  const { mode: previewMode } = usePreviewMode();
  const resolvedMode: "light" | "dark" | null = // if preview mode is set, use it, otherwise use the current site mode
    theme?.foundations.dark && theme.foundations.light && previewMode
      ? ignorePreviewMode
        ? resolvedTheme && ["light", "dark"].includes(resolvedTheme)
          ? (resolvedTheme as "light" | "dark")
          : null
        : previewMode
      : theme?.foundations.dark
        ? "dark"
        : "light";

  const cssVars = React.useMemo(() => {
    if (!theme || !resolvedMode) return {};
    const themeCssVars = createThemeCssVars(theme.foundations, resolvedMode);
    return { ...baseVars, ...themeCssVars, ...theme.foundations.overrides };
  }, [theme, resolvedMode]);

  return (
    <VariantsProvider variants={theme?.variants}>
      <PrimitivesProvider primitives={theme?.primitives}>
        <FontLoader font={theme?.fonts?.heading} />
        <FontLoader font={theme?.fonts?.body} />
        <div
          style={
            {
              ...cssVars,
              ...style,
              "--font-heading": theme?.fonts?.heading,
              "--font-body": theme?.fonts?.body,
            } as React.CSSProperties
          }
          className={cn(!unstyled && "bg-bg text-fg font-body", className)}
          suppressHydrationWarning
          {...props}
        >
          {typeof children === "function" ? children(resolvedMode) : children}
        </div>
      </PrimitivesProvider>
    </VariantsProvider>
  );
};

const baseVars = {
  "--color-bg": "var(--neutral-100)",
  "--color-bg-muted": "var(--neutral-200)",
  "--color-bg-inverse": "var(--neutral-1000)",
  "--color-bg-disabled": "var(--neutral-200)",
  "--color-bg-neutral": "var(--neutral-300)",
  "--color-bg-neutral-hover": "var(--neutral-400)",
  "--color-bg-neutral-active": "var(--neutral-500)",
  "--color-bg-primary": "var(--neutral-1000)",
  "--color-bg-primary-hover": "var(--neutral-900)",
  "--color-bg-primary-active": "var(--neutral-800)",
  "--color-bg-primary-muted": "var(--neutral-200)",
  "--color-bg-success": "var(--success-500)",
  "--color-bg-success-hover": "var(--success-600)",
  "--color-bg-success-active": "var(--success-700)",
  "--color-bg-success-muted": "var(--success-100)",
  "--color-bg-danger": "var(--danger-500)",
  "--color-bg-danger-hover": "var(--danger-600)",
  "--color-bg-danger-active": "var(--danger-700)",
  "--color-bg-danger-muted": "var(--danger-100)",
  "--color-bg-warning": "var(--warning-500)",
  "--color-bg-warning-hover": "var(--warning-600)",
  "--color-bg-warning-active": "var(--warning-700)",
  "--color-bg-warning-muted": "var(--warning-100)",
  "--color-bg-info": "var(--info-500)",
  "--color-bg-info-hover": "var(--info-600)",
  "--color-bg-info-active": "var(--info-700)",
  "--color-bg-info-muted": "var(--info-100)",
  "--color-bg-accent": "var(--accent-500)",
  "--color-bg-accent-hover": "var(--accent-600)",
  "--color-bg-accent-active": "var(--accent-700)",
  "--color-bg-accent-muted": "var(--accent-100)",
  "--color-fg": "var(--neutral-1000)",
  "--color-fg-muted": "var(--neutral-800)",
  "--color-fg-inverse": "var(--neutral-100)",
  "--color-fg-disabled": "var(--neutral-500)",
  "--color-fg-danger": "var(--danger-700)",
  "--color-fg-warning": "var(--warning-700)",
  "--color-fg-success": "var(--success-700)",
  "--color-fg-info": "var(--info-700)",
  "--color-fg-accent": "var(--accent-700)",
  "--color-fg-onNeutral": "var(--neutral-1000)",
  "--color-fg-onPrimary": "var(--neutral-100)",
  "--color-fg-onAccent": "var(--neutral-1000)",
  "--color-fg-onSuccess": "var(--neutral-1000)",
  "--color-fg-onDanger": "var(--neutral-1000)",
  "--color-fg-onWarning": "var(--neutral-1000)",
  "--color-fg-onInfo": "var(--neutral-1000)",
  "--color-border": "var(--neutral-300)",
  "--color-border-field": "var(--neutral-400)",
  "--color-border-control": "var(--neutral-700)",
  "--color-border-disabled": "var(--neutral-300)",
  "--color-border-focus": "var(--accent-500)",
  "--color-border-success": "var(--success-300)",
  "--color-border-accent": "var(--accent-300)",
  "--color-border-danger": "var(--danger-300)",
  "--color-border-warning": "var(--warning-300)",
  "--color-border-info": "var(--info-300)",
};
