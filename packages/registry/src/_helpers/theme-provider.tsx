import React from "react";

import { createTheme } from "@dotui/registry/_style-system/core";
import { registryBackgroundPatterns } from "@dotui/registry/background-patterns/registry";
import { cn } from "@dotui/registry/lib/utils";
import { registryTextures } from "@dotui/registry/textures/registry";
import type { ThemeDefinition } from "@dotui/registry/_style-system/types";

import { FontLoader } from "./font-loader";

type Mode = "light" | "dark";

export const ThemeProvider = ({
  mode,
  theme: themeDefinition,
  children,
  unstyled,
  ...props
}: React.ComponentProps<"div"> & {
  mode?: Mode;
  theme: ThemeDefinition;
  unstyled?: boolean;
  children: React.ReactNode;
}) => {
  const theme = React.useMemo(
    () => createTheme(themeDefinition, true, "oklch"),
    [themeDefinition],
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
    ? registryTextures.find((t) => t.slug === themeDefinition.texture)
    : null;

  const backgroundPattern = themeDefinition.backgroundPattern
    ? registryBackgroundPatterns.find(
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

const transformCssToJSXStyle = (css: Record<string, string>) => {
  return Object.fromEntries(
    Object.entries(css).map(([key, value]) => [
      key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
      value,
    ]),
  );
};
