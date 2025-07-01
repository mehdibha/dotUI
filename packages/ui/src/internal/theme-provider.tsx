import React from "react";

import type { Theme } from "@dotui/style-engine/types";

export const ThemeProvider = ({
  mode,
  theme,
  children,
}: {
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
    <div style={cssVars} className="bg-bg">
      {children}
    </div>
  );
};
