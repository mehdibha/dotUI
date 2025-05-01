"use client";

import React from "react";
import { Style } from "@/modules/styles-2/types";
import { ComponentsProvider } from "./components-provider";
import { FontsProvider } from "./fonts-provider";
import { ThemeProvider } from "./theme-provider";

export interface StyleProviderProps
  extends Omit<React.ComponentProps<"div">, "children" | "style"> {
  style: Style;
  children?: React.ReactNode;
}

export const StyleProvider = ({
  children,
  style,
  ...props
}: StyleProviderProps) => {
  return (
    <div {...props}>
      <ComponentsProvider components={style.components}>
        <ThemeProvider theme={style.theme}>
          <FontsProvider fonts={style.fonts}>{children}</FontsProvider>
        </ThemeProvider>
      </ComponentsProvider>
    </div>
  );
};
