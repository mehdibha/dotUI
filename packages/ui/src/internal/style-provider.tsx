"use client";

import React from "react";

import { createStyle } from "@dotui/style-engine";
import type { Style, StyleDefinition } from "@dotui/style-engine/types";

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
        <ThemeProvider mode={mode} theme={style.theme}>
          {children}
        </ThemeProvider>
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
