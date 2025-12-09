"use client";

import {
  StyleProvider as BaseStyleProvider,
  ThemeProvider as BaseThemeProvider,
} from "@dotui/style-system";
import type {
  StyleProviderProps as BaseStyleProviderProps,
  ThemeProviderProps as BaseThemeProviderProps,
} from "@dotui/style-system";

import { registryBackgroundPatterns } from "./background-patterns/registry";
import { cn } from "./lib/utils";
import { registryTextures } from "./textures/registry";

// Re-export types
export type StyleProviderProps = Omit<
  BaseStyleProviderProps,
  "textures" | "backgroundPatterns" | "cn"
>;
export type ThemeProviderProps = Omit<
  BaseThemeProviderProps,
  "textures" | "backgroundPatterns" | "cn"
>;

/**
 * StyleProvider with registry dependencies injected
 */
export const StyleProvider = (props: StyleProviderProps) => {
  return (
    <BaseStyleProvider
      textures={registryTextures}
      backgroundPatterns={registryBackgroundPatterns}
      cn={cn}
      {...props}
    />
  );
};

/**
 * ThemeProvider with registry dependencies injected
 */
export const ThemeProvider = (props: ThemeProviderProps) => {
  return (
    <BaseThemeProvider
      textures={registryTextures}
      backgroundPatterns={registryBackgroundPatterns}
      cn={cn}
      {...props}
    />
  );
};

// Re-export other providers and hooks from style-system
export {
  FontLoader,
  useCurrentStyle,
  useVariant,
  VariantsProvider,
} from "@dotui/style-system";
