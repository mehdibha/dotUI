"use client";

import React from "react";
import { useCurrentTheme } from "@/modules/themes/atoms/themes-atom";
import { ThemeProvider, type ThemeProviderProps } from "./style-provider";

export const CurrentThemeProvider = ({
  children,
  ...props
}: Omit<ThemeProviderProps, "theme">) => {
  const { currentTheme } = useCurrentTheme();
  return (
    <ThemeProvider theme={currentTheme} {...props}>
      {children}
    </ThemeProvider>
  );
};
