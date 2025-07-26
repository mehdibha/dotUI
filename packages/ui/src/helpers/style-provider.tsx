"use client";

import React from "react";

import type { StyleDefinition } from "@dotui/style-engine/types";

import { ThemeProvider } from "./theme-provider";
import { VariantsProvider } from "./variants-provider";

const StyleContext = React.createContext<StyleDefinition | null>(null);

export interface StyleProviderProps
  extends Omit<React.ComponentProps<"div">, "style"> {
  mode?: "light" | "dark";
  style?: StyleDefinition;
  unstyled?: boolean;
}

export const StyleProvider = ({
  mode,
  style,
  children,
  unstyled,
  ...props
}: StyleProviderProps) => {
  if (!style) {
    return <div {...props}>{children}</div>;
  }

  return (
    <StyleContext value={style}>
      <VariantsProvider variants={style.variants}>
        <ThemeProvider
          mode={mode}
          theme={style.theme}
          data-focus-style={style.variants["focus-style"]}
          unstyled={unstyled}
          {...props}
        >
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
