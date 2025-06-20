"use client";

import React from "react";

import type { Style } from "@dotui/style-engine/types";

import { VariantsProvider } from "./variants-provider";

const StyleContext = React.createContext<Style | null>(null);

export interface StyleProviderProps
  extends Omit<React.ComponentProps<"div">, "style"> {
  style: Style;
}

export const StyleProvider = ({
  style,
  children,
  ...props
}: StyleProviderProps) => {
  return (
    <StyleContext value={style}>
      <VariantsProvider variants={style.variants}>{children}</VariantsProvider>
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
