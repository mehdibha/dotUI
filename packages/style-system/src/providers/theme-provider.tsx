"use client";

import * as React from "react";

import { createTheme } from "../core";
import { FontLoader } from "./font-loader";
import type {
  BackgroundPatternRegistryItem,
  TextureRegistryItem,
  ThemeDefinition,
} from "../types";

type Mode = "light" | "dark";

export interface ThemeProviderProps extends React.ComponentProps<"div"> {
  mode?: Mode;
  theme: ThemeDefinition;
  unstyled?: boolean;
  children: React.ReactNode;
  /** Texture registry items (injected by registry package) */
  textures?: TextureRegistryItem[];
  /** Background pattern registry items (injected by registry package) */
  backgroundPatterns?: BackgroundPatternRegistryItem[];
  /** Custom className utility function (defaults to simple concatenation) */
  cn?: (...classes: (string | undefined | null | false)[]) => string;
}

const defaultCn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const ThemeProvider = ({
  mode,
  theme: themeDefinition,
  children,
  unstyled,
  textures,
  backgroundPatterns,
  cn = defaultCn,
  ...props
}: ThemeProviderProps) => {
  const theme = React.useMemo(
    () =>
      createTheme(themeDefinition, true, "oklch", {
        textures,
        backgroundPatterns,
      }),
    [themeDefinition, textures, backgroundPatterns],
  );

  const hasLightAndDark =
    themeDefinition.colors.activeModes.includes("light") &&
    themeDefinition.colors.activeModes.includes("dark");

  const allCssVars = React.useMemo(() => {
    if (!mode && hasLightAndDark) {
      return {};
    }

    const effectiveMode = hasLightAndDark && mode ? mode : "light";
    const vars = {
      "radius-factor": theme.cssVars.light?.["radius-factor"],
      ...(hasLightAndDark ? theme.cssVars[effectiveMode] : theme.cssVars.light),
      ...theme.cssVars.theme,
    };

    return Object.fromEntries(
      Object.entries(vars).map(([key, value]) => [`--${key}`, value]),
    );
  }, [theme, mode, hasLightAndDark]);

  const texture = themeDefinition.texture
    ? textures?.find((t) => t.slug === themeDefinition.texture)
    : null;

  const backgroundPattern = themeDefinition.backgroundPattern
    ? backgroundPatterns?.find(
        (p) => p.slug === themeDefinition.backgroundPattern,
      )
    : null;

  const styleProp = React.useMemo(() => {
    return {
      letterSpacing: `${themeDefinition.letterSpacing}em !important`,
      "--font-heading": themeDefinition.fonts.heading,
      "--font-body": themeDefinition.fonts.body,
      // Force native UI (including scrollbars) to render in the specified color scheme
      // when a mode is provided. This ensures children inherit dark/light scrollbars.
      ...(mode ? { colorScheme: mode } : {}),
      ...allCssVars,
    };
  }, [themeDefinition.letterSpacing, allCssVars, themeDefinition.fonts, mode]);

  return (
    <>
      <FontLoader font={themeDefinition.fonts.heading} />
      <FontLoader font={themeDefinition.fonts.body} />
      <div
        style={styleProp}
        {...props}
        suppressHydrationWarning
        className={cn(
          !unstyled &&
            "relative isolate overflow-hidden bg-bg font-body text-fg duration-150",
          props.className,
        )}
      >
        {texture && !unstyled && (
          <div
            style={{
              ...transformCssToJSXStyle(texture.css[".texture"]),
              position: "absolute",
              width: "auto",
              height: "auto",
            }}
          />
        )}
        {backgroundPattern && !unstyled && (
          <div
            style={transformCssToJSXStyle(backgroundPattern.css[".bg-pattern"])}
          />
        )}
        {children}
      </div>
    </>
  );
};

const transformCssToJSXStyle = (
  css?: Record<string, string>,
): React.CSSProperties => {
  if (!css) return {};
  return Object.fromEntries(
    Object.entries(css).map(([key, value]) => [
      key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
      value,
    ]),
  ) as React.CSSProperties;
};
