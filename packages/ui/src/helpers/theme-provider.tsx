import React from "react";

import { registryBackgroundPatterns } from "@dotui/registry-definition/registry-bg-patterns";
import { registryTextures } from "@dotui/registry-definition/registry-textures";
import { createTheme } from "@dotui/style-engine";
import { cn } from "@dotui/ui/lib/utils";
import type { ThemeDefinition } from "@dotui/style-engine/types";

type Mode = "light" | "dark";

export const ThemeProvider = ({
  mode,
  theme: themeDefinition,
  focusRing,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  mode?: Mode;
  theme: ThemeDefinition;
  focusRing: string;
  children: React.ReactNode;
}) => {
  const theme = React.useMemo(
    () => createTheme(themeDefinition),
    [themeDefinition],
  );

  const hasLightAndDark =
    themeDefinition.colors.modes.light && themeDefinition.colors.modes.dark;

  const allCssVars = React.useMemo(() => {
    if (!mode && hasLightAndDark) {
      return {};
    }

    const vars = {
      "radius-factor": theme.cssVars.light?.["radius-factor"],
      ...(hasLightAndDark ? theme.cssVars[mode!] : theme.cssVars.light),
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
      ...allCssVars,
    };
  }, [themeDefinition.letterSpacing, allCssVars, themeDefinition.fonts]);

  return (
    <>
      <FontLoader font={themeDefinition.fonts.heading} />
      <FontLoader font={themeDefinition.fonts.body} />
      <div
        style={styleProp}
        {...props}
        data-focus-style={focusRing}
        className={cn("relative bg-bg font-body text-fg", props.className)}
      >
        {texture && (
          <div style={transformCssToJSXStyle(texture.css[".texture"])} />
        )}
        {backgroundPattern && (
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

export function FontLoader({ font }: { font: string | null | undefined }) {
  if (!font) return null;
  const googleFontUrl = generateGoogleFontUrl(font);
  return <link href={googleFontUrl} rel="stylesheet" />;
}

function generateGoogleFontUrl(font: string) {
  const familyName = font.replace(/\s+/g, "+");

  return `https://fonts.googleapis.com/css?family=${familyName}`;
}
