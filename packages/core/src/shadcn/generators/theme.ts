import type { RegistryItem } from "shadcn/schema";

import { createTheme, type Theme as ColorTheme } from "@dotui/colors";
import type { StyleConfig } from "@dotui/core/schemas/style";

/**
 * Convert color scales to CSS variables
 */
function scalesToCssVars(
  scales: Record<string, Record<string, string>>,
): Record<string, string> {
  const cssVars: Record<string, string> = {};

  for (const [paletteName, scale] of Object.entries(scales)) {
    for (const [step, value] of Object.entries(scale)) {
      cssVars[`--${paletteName}-${step}`] = value;
    }
  }

  return cssVars;
}

/**
 * Generate CSS variables for a single mode from StyleConfig
 */
function generateModeCssVars(
  colorTheme: ColorTheme,
  modeName: string,
  config: StyleConfig,
): Record<string, string> {
  const modeTheme = colorTheme[modeName];
  if (!modeTheme) return {};

  // Color variables from scales
  const colorVars = scalesToCssVars(modeTheme.scales);

  // Theme variables (radius, spacing, typography)
  const themeVars: Record<string, string> = {
    "--radius": `${config.theme.radius}rem`,
    "--spacing": `${config.theme.spacing}rem`,
    "--font-sans": config.theme.typography.font,
  };

  // Optional typography vars
  if (config.theme.typography.letterSpacing !== undefined) {
    themeVars["--letter-spacing"] = `${config.theme.typography.letterSpacing}em`;
  }
  if (config.theme.typography.lineHeight !== undefined) {
    themeVars["--line-height"] = `${config.theme.typography.lineHeight}`;
  }

  return { ...colorVars, ...themeVars };
}

export function generateRegistryTheme(options: {
  styleName: string;
  baseUrl: string;
  config: StyleConfig;
}): RegistryItem {
  const { styleName, config } = options;

  // Generate color scales from config
  const colorTheme = createTheme(config.theme.colors);

  // Generate CSS vars for each mode
  const lightVars = generateModeCssVars(colorTheme, "light", config);
  const darkVars = generateModeCssVars(colorTheme, "dark", config);

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    extends: "none",
    type: "registry:theme",
    title: `${styleName} theme`,
    description: `Color theme for ${styleName} style`,
    cssVars: {
      light: lightVars,
      dark: darkVars,
    },
    css: {
      "@layer base": {
        "*": {
          "border-color": "var(--color-border)",
        },
        body: {
          "background-color": "var(--color-bg)",
          color: "var(--color-fg)",
        },
      },
    },
  };
}
