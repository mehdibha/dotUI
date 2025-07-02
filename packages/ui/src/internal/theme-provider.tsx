import React from "react";

import type { Theme } from "@dotui/style-engine/types";
import { cn } from "@dotui/ui/lib/utils";

export const ThemeProvider = ({
  mode,
  theme,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  mode: "light" | "dark";
  theme: Theme;
  children: React.ReactNode;
}) => {
  const cssVars = React.useMemo(() => {
    const addPrefix = (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key.startsWith("--") ? key : `--${key}`,
          value,
        ]),
      );
    };

    return {
      ...addPrefix(theme.cssVars.theme),
      ...addPrefix(theme.cssVars[mode]),
    };
  }, [theme, mode]);

  return (
    <div style={cssVars} {...props} className={cn("bg-bg text-fg", props.className)}>
      {children}
    </div>
  );
};
