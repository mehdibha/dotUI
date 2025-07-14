import React from "react";

import { createTheme } from "@dotui/style-engine/lib";
import { cn } from "@dotui/ui/lib/utils";
import type { ThemeDefinition } from "@dotui/style-engine/types-v2";

export const ThemeProvider = ({
  mode,
  theme: themeDefinition,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  mode: "light" | "dark";
  theme: ThemeDefinition;
  children: React.ReactNode;
}) => {
  const { cssVars } = React.useMemo(
    () => createTheme(themeDefinition),
    [themeDefinition],
  );

  const allCssVars = React.useMemo(() => {
    const vars = {
      ...(cssVars.dark ? cssVars[mode] : cssVars.light),
      ...cssVars.theme,
    };

    return Object.fromEntries(
      Object.entries(vars).map(([key, value]) => [`--${key}`, value]),
    );
  }, [cssVars, mode]);

  return (
    <div
      style={allCssVars}
      {...props}
      className={cn("bg-bg text-fg", props.className)}
    >
      {children}
    </div>
  );
};
