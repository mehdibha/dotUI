import React from "react";
import { cn } from "@/lib/utils";
import { Theme } from "@/modules/themes/types";
import { createThemeCssVars } from "../lib/create-theme";

interface ThemeProviderProps extends React.ComponentProps<"div"> {
  theme?: Theme;
  mode?: "light" | "dark";
}
export const ThemeProvider = ({
  theme,
  mode,
  children,
  className,
  style,
  ...props
}: ThemeProviderProps) => {
  const cssVars = React.useMemo(() => {
    if (!theme || !mode) return {};
    return createThemeCssVars(theme.foundations, mode);
  }, [theme, mode]);

  return (
    <div
      style={{
        ...cssVars,
        ...style,
      }}
      className={cn("bg-bg text-fg", className)}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </div>
  );
};
