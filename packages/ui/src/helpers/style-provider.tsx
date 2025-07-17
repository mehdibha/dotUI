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
}

export const StyleProvider = ({
  mode,
  style,
  children,
  ...props
}: StyleProviderProps) => {
  const [isMounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!style || !isMounted) {
    return <div {...props}>{children}</div>;
  }

  const modes = style.theme.colors.modes.map((mode) => mode.mode);

  return (
    <StyleContext value={style}>
      <VariantsProvider variants={style.variants}>
        <ThemeProvider
          modes={modes}
          mode={mode}
          theme={style.theme}
          focusRing={style.variants["focus-style"]}
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
