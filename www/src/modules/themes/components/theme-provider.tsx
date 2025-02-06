import React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { PrimitivesProvider } from "@/modules/themes/contexts/primitives-context";
import { VariantsProvider } from "@/modules/themes/contexts/variants-context";
import { createThemeCssVars } from "@/modules/themes/lib/create-theme";
import { Theme } from "@/modules/themes/types";

interface ThemeProviderProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  children:
    | React.ReactNode
    | ((mode: "light" | "dark" | undefined) => React.ReactNode);
  mode?: "light" | "dark";
  theme?: Theme;
}
export const ThemeProvider = ({
  theme,
  mode,
  children,
  className,
  style,
  ...props
}: ThemeProviderProps) => {
  const { resolvedTheme } = useTheme();
  const currentMode = (mode ?? resolvedTheme === "light") ? "light" : "dark";
  const cssVars = React.useMemo(() => {
    if (!theme || !resolvedTheme) return {};
    const themeCssVars = createThemeCssVars(
      theme.foundations,
      theme.foundations.dark // we check if theme supports dark mode
        ? (theme.defaultDisplayMode ?? currentMode)
        : "light"
    );
    return { ...themeCssVars, ...baseVars, ...theme.foundations.overrides };
  }, [theme, resolvedTheme, currentMode]);

  const resolvedMode =
    theme?.foundations.dark && resolvedTheme && resolvedTheme !== "system"
      ? resolvedTheme === "light"
        ? "light"
        : "dark"
      : undefined;

  return (
    <VariantsProvider variants={theme?.variants}>
      <PrimitivesProvider primitives={theme?.primitives}>
        <div
          style={{
            ...cssVars,
            ...style,
          }}
          className={cn("bg-bg text-fg isolate", className)}
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
  "--color-bg": "var(--color-neutral-100)",
  "--color-bg-muted": "var(--color-neutral-200)",
  "--color-bg-inverse": "var(--color-neutral-1000)",
  "--color-bg-disabled": "var(--color-neutral-200)",
  "--color-bg-neutral": "var(--color-neutral-300)",
  "--color-bg-neutral-hover": "var(--color-neutral-400)",
  "--color-bg-neutral-active": "var(--color-neutral-500)",
  "--color-bg-primary": "var(--color-neutral-1000)",
  "--color-bg-primary-hover": "var(--color-neutral-900)",
  "--color-bg-primary-active": "var(--color-neutral-800)",
  "--color-bg-primary-muted": "var(--color-neutral-200)",
  "--color-bg-success": "var(--color-success-500)",
  "--color-bg-success-hover": "var(--color-success-600)",
  "--color-bg-success-active": "var(--color-success-700)",
  "--color-bg-success-muted": "var(--color-success-100)",
  "--color-bg-danger": "var(--color-danger-500)",
  "--color-bg-danger-hover": "var(--color-danger-600)",
  "--color-bg-danger-active": "var(--color-danger-700)",
  "--color-bg-danger-muted": "var(--color-danger-100)",
  "--color-bg-warning": "var(--color-warning-500)",
  "--color-bg-warning-hover": "var(--color-warning-600)",
  "--color-bg-warning-active": "var(--color-warning-700)",
  "--color-bg-warning-muted": "var(--color-warning-100)",
  "--color-bg-info": "var(--color-info-500)",
  "--color-bg-info-hover": "var(--color-info-600)",
  "--color-bg-info-active": "var(--color-info-700)",
  "--color-bg-info-muted": "var(--color-info-100)",
  "--color-bg-accent": "var(--color-accent-500)",
  "--color-bg-accent-hover": "var(--color-accent-600)",
  "--color-bg-accent-active": "var(--color-accent-700)",
  "--color-bg-accent-muted": "var(--color-accent-100)",
  "--color-fg": "var(--color-neutral-1000)",
  "--color-fg-muted": "var(--color-neutral-800)",
  "--color-fg-inverse": "var(--color-neutral-100)",
  "--color-fg-disabled": "var(--color-neutral-500)",
  "--color-fg-danger": "var(--color-danger-700)",
  "--color-fg-warning": "var(--color-warning-700)",
  "--color-fg-success": "var(--color-success-700)",
  "--color-fg-info": "var(--color-info-700)",
  "--color-fg-accent": "var(--color-accent-700)",
  "--color-fg-onNeutral": "var(--color-neutral-1000)",
  "--color-fg-onPrimary": "var(--color-neutral-100)",
  "--color-fg-onAccent": "var(--color-neutral-1000)",
  "--color-fg-onSuccess": "var(--color-neutral-1000)",
  "--color-fg-onDanger": "var(--color-neutral-1000)",
  "--color-fg-onWarning": "var(--color-neutral-1000)",
  "--color-fg-onInfo": "var(--color-neutral-1000)",
  "--color-border": "var(--color-neutral-300)",
  "--color-border-field": "var(--color-neutral-400)",
  "--color-border-control": "var(--color-neutral-700)",
  "--color-border-disabled": "var(--color-neutral-300)",
  "--color-border-focus": "var(--color-accent-500)",
  "--color-border-success": "var(--color-success-300)",
  "--color-border-accent": "var(--color-accent-300)",
  "--color-border-danger": "var(--color-danger-300)",
  "--color-border-warning": "var(--color-warning-300)",
  "--color-border-info": "var(--color-info-300)",
};
