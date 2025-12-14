"use client";

import * as React from "react";

import { ThemeProvider } from "./theme-provider";
import { VariantsProvider } from "./variants-provider";
import type {
  BackgroundPatternRegistryItem,
  StyleDefinition,
  TextureRegistryItem,
} from "../types";

const StyleContext = React.createContext<StyleDefinition | null>(null);

export interface StyleProviderProps
  extends Omit<React.ComponentProps<"div">, "style"> {
  mode?: "light" | "dark";
  style?: StyleDefinition;
  unstyled?: boolean;
  /** Texture registry items (injected by registry package) */
  textures?: TextureRegistryItem[];
  /** Background pattern registry items (injected by registry package) */
  backgroundPatterns?: BackgroundPatternRegistryItem[];
  /** Custom className utility function */
  cn?: (...classes: (string | undefined | null | false)[]) => string;
}

export const StyleProvider = ({
  mode,
  style,
  children,
  unstyled,
  textures,
  backgroundPatterns,
  cn,
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
          textures={textures}
          backgroundPatterns={backgroundPatterns}
          cn={cn}
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
