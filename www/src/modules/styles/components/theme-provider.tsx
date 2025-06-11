import type { Theme } from "@/modules/styles/types";
import React from "react";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useStyles } from "@/modules/styles/atoms/styles-atom";
import { useTheme } from "next-themes";

export interface ThemeProviderProps
  extends Omit<React.ComponentProps<"div">, "children" | "style"> {
  theme: Theme;
  mode?: "light" | "dark" | "site" | "storage";
  children?: React.ReactNode;
}

export const ThemeProvider = ({
  theme,
  mode = "storage",
  children,
  className,
  ...props
}: ThemeProviderProps) => {
  const { currentMode } = useStyles();
  const isMounted = useMounted();
  const { resolvedTheme } = useTheme();

  // Check which modes are supported
  const hasLightMode = Object.keys(theme.light).length > 0;
  const hasDarkMode = Object.keys(theme.dark).length > 0;

  // Determine the effective mode based on support
  let effectiveMode =
    mode === "site" ? resolvedTheme : mode === "storage" ? currentMode : mode;

  // If the requested mode isn't supported, fall back to the supported mode
  if (effectiveMode === "light" && !hasLightMode && hasDarkMode) {
    effectiveMode = "dark";
  } else if (effectiveMode === "dark" && !hasDarkMode && hasLightMode) {
    effectiveMode = "light";
  }

  const styleProps = React.useMemo(() => {
    if (!isMounted) return {};
    return Object.entries({
      ...(effectiveMode === "light" ? theme.light : theme.dark),
      ...theme.theme,
    }).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [`--${key}`]: value,
      }),
      {},
    );
  }, [effectiveMode, theme, isMounted]);

  return (
    <div
      className={cn(
        "bg-bg text-fg",
        isMounted && effectiveMode === "light" ? "light" : "dark",
        className,
      )}
      {...props}
      style={styleProps}
    >
      {children}
    </div>
  );
};
