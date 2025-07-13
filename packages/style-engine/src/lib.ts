import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import type { CssColor } from "@adobe/leonardo-contrast-colors";

import { RADIUS_TOKENS } from "@dotui/registry-definition/registry-tokens";

import { DEFAULT_VARIANTS } from "./constants";
import type {
  BackgroundPattern,
  ColorTokens,
  Css,
  Fonts,
  LetterSpacing,
  MinimizedStyleDefinition,
  MinimizedThemeDefinition,
  MinimizedVariantsDefinition,
  ModeDefinition,
  Radius,
  Shadows,
  Spacing,
  Style,
  StyleDefinition,
  Texture,
  Theme,
  ThemeDefinition,
  Variants,
  VariantsDefinition,
} from "./types-v2";

/* eslint-disable */

// ---------------------------- Minimized definitions -> Definitions ---------------------------- //

const createThemeDefinition = (
  minimizedThemeDefinition: MinimizedThemeDefinition,
): ThemeDefinition => {
  return {} as ThemeDefinition;
};

const createVariantsDefinition = (
  minimizedVariantsDefinition: MinimizedVariantsDefinition,
): VariantsDefinition => {
  return {} as VariantsDefinition;
};

const createStyleDefinition = (
  minimizedStyleDefinition: MinimizedStyleDefinition,
): StyleDefinition => {
  const {
    theme: minimizedThemeDefinition,
    variants: minimizedVariantsDefinition,
    icons,
  } = minimizedStyleDefinition;

  return {
    theme: createThemeDefinition(minimizedThemeDefinition),
    variants: createVariantsDefinition(minimizedVariantsDefinition),
    icons,
  };
};

// ---------------------------- Definitions -> Minimized definitions ---------------------------- //

const createMinimizedThemeDefinition = (
  themeDefinition: ThemeDefinition,
): MinimizedThemeDefinition => {
  return {} as MinimizedThemeDefinition;
};

const createMinimizedVariantsDefinition = (
  variantsDefinition: VariantsDefinition,
): MinimizedVariantsDefinition => {
  return {} as MinimizedVariantsDefinition;
};

const createMinimizedStyleDefinition = (
  styleDefinition: StyleDefinition,
): MinimizedStyleDefinition => {
  const {
    theme: themeDefinition,
    variants: variantsDefintion,
    icons,
  } = styleDefinition;

  return {
    theme: createMinimizedThemeDefinition(themeDefinition),
    variants: createMinimizedVariantsDefinition(variantsDefintion),
    icons,
  };
};

// ---------------------------- Defintions -> Processed ---------------------------- //

const createShadowsThemeVars = (background: Shadows): Record<string, string> => {
  return {};
};

const createTextureCss = (texture: Texture): Css => {
  return {};
  // return {
  //   ".texture": {
  //     "background-image": "url(https://matsu-theme.vercel.app/texture.jpg)",
  //     "background-size": "100% 100%",
  //     "background-repeat": "repeat",
  //     opacity: "0.12",
  //     "mix-blend-mode": "multiply",
  //     "z-index": "100",
  //     isolation: "isolate",
  //     position: "fixed",
  //     inset: "0",
  //     width: "100vw",
  //     height: "100dvh",
  //     "pointer-events": "none",
  //   },
  // };
};

const createBackgroundPatternCss = (
  backgroundPattern: BackgroundPattern,
): Css => {
  return {};
};

const createLetterSpacingThemeVars = (letterSpacing: LetterSpacing): Css => {
  return {
    "@layer base": {
      body: {
        "font-size": "var(--text-base)",
        "letter-spacing": `${letterSpacing.toString()}em`,
      },
    },
  };
};

const createFontsThemeVars = (fonts: Fonts): Record<string, string> => {
  return {
    "font-heading": "var(--font-heading)",
    "font-body": "var(--font-body)",
  };
};

const createSpacingThemeVars = (spacing: Spacing): Record<string, string> => {
  return {
    spacing: `${spacing.toString()}rem`,
  };
};

export const createRadiusVars = (radius: Radius): Theme => {
  const themeCssVars = Object.entries(RADIUS_TOKENS).reduce(
    (acc, [key, value]) => {
      acc[value.name] = value.defaultValue;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    cssVars: {
      light: {
        "radius-factor": radius.toString(),
      },
      theme: {
        ...themeCssVars,
      },
    },
  };
};

export const createModeCssVars = (
  modeDefinition: ModeDefinition,
): Record<string, string> => {
  const { neutral: neutralScale, ...restBaseScales } =
    modeDefinition.baseScales;
  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys: neutralScale.colorKeys.map((color) => color.color) as CssColor[],
    ratios: neutralScale.ratios,
  });

  const colors = Object.entries({
    ...modeDefinition.semanticScales,
    ...restBaseScales,
  }).map(([name, val]) => {
    const props = {
      name,
      colorKeys: val.colorKeys.map((color) => color.color) as CssColor[],
      ratios: val.ratios,
    };
    const color = new LeonardoColor(props);
    return color;
  });

  const generatedTheme = new LeonardoTheme({
    colors,
    backgroundColor: neutral,
    lightness: modeDefinition.lightness,
    saturation: modeDefinition.saturation,
    contrast: modeDefinition.contrast,
    output: "OKLCH",
  });

  const cssVars = generatedTheme.contrastColors
    .map((color) => {
      if ("name" in color) {
        return color.values.map((item, index) => {
          const scale = (index + 1) * 100;
          const entries: [string, string][] = [
            [`${color.name}-${scale}`, item.value],
            // [`${color.name}-${scale}`, hexToOklchString(item.value)],
          ];
          // TODO: CREATE FOREGROUNDS DYNAMICALLY
          // if (createForegrounds) {
          //   const bgColor = item.value;
          //   const fg = getContrastTextColor(bgColor.replace("deg", ""));
          //   entries.push([`--${color.name}-${scale}-fg`, fg]);
          // }
          return entries;
        });
      }
      return undefined;
    })
    .filter((color): color is NonNullable<typeof color> => Boolean(color))
    .flatMap((color) => color)
    .reduce(
      (acc, curr) => {
        const result: Record<string, string> = {};
        curr.forEach(([key, value]) => {
          result[key] = value;
        });
        return { ...acc, ...result };
      },
      {} as Record<string, string>,
    );

  return cssVars;
};

export const createColorThemeVars = (
  tokensDefinition: ColorTokens,
): Record<string, string> => {
  const cssThemeVars = Object.entries(tokensDefinition).reduce(
    (acc, [key, value]) => {
      acc[value.name] = value.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return cssThemeVars;
};

export const createTheme = (themeDefinition: ThemeDefinition): Theme => {
  const {
    colors,
    radius,
    spacing,
    fonts,
    letterSpacing,
    backgroundPattern,
    shadows,
    texture,
  } = themeDefinition;

  const supportsLightAndDark = colors.modes.length > 1;

  const textureCss = createTextureCss(texture);
  const backgroundPatternCss = createBackgroundPatternCss(backgroundPattern);
  const letterSpacingCss = createLetterSpacingThemeVars(letterSpacing);
  const spacingThemeVars = createSpacingThemeVars(spacing);
  const fontsThemeVars = createFontsThemeVars(fonts);
  const shadowsThemeVars = createShadowsThemeVars(shadows);

  const {
    cssVars: { light: radiusLightVars, theme: radiusThemeVars },
  } = createRadiusVars(radius);

  // If theme supports one mode, always put it in light mode
  const lightCssVars = supportsLightAndDark
    ? createModeCssVars(
        colors.modes.find((mode) => mode.mode === "light") as ModeDefinition,
      )
    : createModeCssVars(colors.modes[0] as ModeDefinition);
  const darkCssVars = supportsLightAndDark
    ? createModeCssVars(
        colors.modes.find((mode) => mode.mode === "dark") as ModeDefinition,
      )
    : {};

  const colorThemeVars = createColorThemeVars(colors.tokens);

  return {
    css: {
      // TODO: probably this need a deep merge
      ...letterSpacingCss,
      ...textureCss,
      ...backgroundPatternCss,
    },
    cssVars: {
      light: { ...lightCssVars, ...radiusLightVars },
      dark: { ...darkCssVars },
      theme: {
        ...colorThemeVars,
        ...radiusThemeVars,
        ...spacingThemeVars,
        ...fontsThemeVars,
        ...shadowsThemeVars
      },
    },
  };
};

export const createVariants = (
  variantsDefinition: VariantsDefinition,
): Variants => {
  const {
    buttons,
    calendars,
    "badge-and-tag-group": badgeAndTagGroup,
    "list-box-and-menu": listBoxAndMenu,
    checkboxes,
    radios,
    inputs,
    overlays,
    pickers,
    selection,
    ...restVariants
  } = variantsDefinition;

  return {
    ...DEFAULT_VARIANTS,
    ...restVariants,
    button: buttons,
    calendar: calendars,
    badge: badgeAndTagGroup,
    "tag-group": badgeAndTagGroup,
    "list-box": listBoxAndMenu,
    menu: listBoxAndMenu,
    checkbox: checkboxes,
    "radio-group": radios,
    input: inputs,
    popover: overlays,
    modal: overlays,
    drawer: overlays,
    "date-picker": pickers,
    "date-range-picker": pickers,
    combobox: pickers,
    select: selection,
  };
};

export const createStyle = (styleDefintion: StyleDefinition): Style => {
  const { theme, icons, variants } = styleDefintion;

  return {
    theme: createTheme(theme),
    icons,
    variants: createVariants(variants),
  };
};
