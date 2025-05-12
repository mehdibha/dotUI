"use client";

import React from "react";
import { Style } from "@/modules/styles/types";
import { ComponentsProvider } from "./components-provider";
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
    <StyleContext value={style}>
      <ComponentsProvider components={style.components}>
        <ThemeProvider theme={style.theme} mode={mode} {...props}>
          <FontsProvider fonts={style.fonts}>{children}</FontsProvider>
        </ThemeProvider>
      </ComponentsProvider>
    </StyleContext>
  );
};

const StyleContext = React.createContext<Style | null>(null);

export const useCurrentStyle = () => {
  const style = React.useContext(StyleContext);
  if (!style) throw new Error("StyleProvider not found");
  return style;
};
