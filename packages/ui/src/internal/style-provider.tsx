"use client";

import React from "react";

import { Skeleton } from "@dotui/ui/components/skeleton";
import type { Style } from "@dotui/style-engine/types";

import { FontsProvider } from "./fonts-provider";
import { ThemeProvider } from "./theme-provider";
import { VariantsProvider } from "./variants-provider";

const StyleContext = React.createContext<Style | null>(null);

export interface StyleProviderProps
  extends Omit<React.ComponentProps<"div">, "style"> {
  mode: "light" | "dark";
  style: Style;
}

export const StyleProvider = ({
  mode,
  style,
  children,
  ...props
}: StyleProviderProps) => {
  return (
    <StyleContext value={style}>
      <VariantsProvider variants={style.variants}>
        <FontsProvider fonts={style.fonts}>
          <ThemeProvider mode={mode} theme={style.theme} {...props}>
            {children}
          </ThemeProvider>
        </FontsProvider>
      </VariantsProvider>
    </StyleContext>
  );
};

export const useCurrentStyle = () => {
  const style = React.useContext(StyleContext);
  if (!style) {
    return null;
  }
  return style;
};
