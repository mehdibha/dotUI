"use client";

import React from "react";
import { ComponentsProvider } from "@/modules/styles/contexts/components-context";
import { PreferencesProvider } from "@/modules/styles/contexts/preferences-context";
import { Style } from "@/modules/styles/types";
import { FontsProvider } from "./fonts-provider";
import { ThemeProvider, ThemeProviderProps } from "./theme-provider";

export interface StyleProviderProps
  extends Omit<React.ComponentProps<"div">, "children" | "style"> {
  mode?: ThemeProviderProps["mode"];
  style: Style;
  children?: React.ReactNode;
}

export const StyleProvider = ({
  children,
  style,
  mode,
  ...props
}: StyleProviderProps) => {
  return (
    <PreferencesProvider preferences={style.preferences}>
      <ComponentsProvider components={style.components}>
        <ThemeProvider theme={style.theme} mode={mode} {...props}>
          <FontsProvider fonts={style.fonts}>{children}</FontsProvider>
        </ThemeProvider>
      </ComponentsProvider>
    </PreferencesProvider>
  );
};
