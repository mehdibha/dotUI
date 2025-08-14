// TODO: This plugin needs a refactor. it's still wip
const plugin = require("tailwindcss/plugin");
const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
];

function getTailwindCssFile(cwd) {
  const files = fg.globSync(["**/*.css", "**/*.scss"], {
    cwd,
    deep: 5,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!files.length) {
    console.log("No css files found in", cwd);
    return null;
  }

  for (const file of files) {
    const contents = fs.readFileSync(path.resolve(cwd, file), "utf8");
    if (
      contents.includes(`@import "tailwindcss"`) ||
      contents.includes(`@import 'tailwindcss'`)
    ) {
      return file;
    }
  }

  return null;
}

function isColor(value) {
  if (!value || typeof value !== "string") return false;

  const trimmed = value.trim().toLowerCase();

  // Check for hex colors: #fff, #ffffff, #123abc
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return true;

  // Check for rgb/rgba: rgb(255, 255, 255), rgba(255, 255, 255, 0.5)
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/i.test(trimmed))
    return true;

  // Check for hsl/hsla: hsl(360, 100%, 50%), hsla(360, 100%, 50%, 0.5)
  if (
    /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/i.test(trimmed)
  )
    return true;

  // Check for newer CSS color functions: lab(), lch(), color(), etc.
  if (/^(lab|lch|color|oklab|oklch|hwb)\s*\(/i.test(trimmed)) return true;

  // Check for CSS variables that might contain colors: var(--some-color)
  if (/^var\s*\(\s*--[\w-]+\s*(,.*?)?\s*\)$/i.test(trimmed)) return true;

  return false;
}

function parseColorToRgb(colorValue) {
  if (!colorValue || typeof colorValue !== "string") return null;

  const trimmed = colorValue.trim();

  // Parse hex colors
  const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
    };
  }

  // Parse rgb/rgba
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)$/i,
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  // Parse hsl/hsla
  const hslMatch = trimmed.match(
    /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*[\d.]+)?\s*\)$/i,
  );
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h >= 0 && h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 1 / 6 && h < 1 / 3) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 1 / 3 && h < 1 / 2) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 1 / 2 && h < 2 / 3) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 2 / 3 && h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  return null;
}

function calculateLuminance(r, g, b) {
  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function calculateContrastRatio(luminance1, luminance2) {
  // WCAG contrast ratio formula: (L1 + 0.05) / (L2 + 0.05)
  // where L1 is the lighter color and L2 is the darker color
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastColor(colorValue) {
  const rgb = parseColorToRgb(colorValue);

  if (!rgb) {
    // Fallback for unparseable colors (like CSS variables)
    return "black";
  }

  const colorLuminance = calculateLuminance(rgb.r, rgb.g, rgb.b);

  // Calculate contrast ratios with black and white
  const blackLuminance = 0; // Pure black
  const whiteLuminance = 1; // Pure white

  const contrastWithBlack = calculateContrastRatio(
    colorLuminance,
    blackLuminance,
  );
  const contrastWithWhite = calculateContrastRatio(
    colorLuminance,
    whiteLuminance,
  );

  // Return the color that gives higher contrast
  return contrastWithBlack > contrastWithWhite ? "black" : "white";
}

function readCssVars(rawCss) {
  const result = {};

  try {
    const root = postcss.parse(rawCss);

    root.walkRules((rule) => {
      const selector = rule.selector.trim();

      let theme = null;

      if (selector === ":root") {
        theme = "light";
      } else if (selector === ".dark" || selector === ":root.dark") {
        theme = "dark";
      } else if (selector.startsWith(".")) {
        theme = selector.slice(1);
      }

      if (theme) {
        if (!result[theme]) {
          result[theme] = {};
        }

        rule.walkDecls((decl) => {
          if (decl.prop.startsWith("--")) {
            const varName = decl.prop.slice(2);
            result[theme][varName] = decl.value.trim();
          }
        });
      }
    });

    root.walkAtRules("layer", (atRule) => {
      if (atRule.params === "base") {
        atRule.walkRules((rule) => {
          const selector = rule.selector.trim();
          let theme = null;

          if (selector === ":root") {
            theme = "light";
          } else if (selector === ".dark" || selector === ":root.dark") {
            theme = "dark";
          } else if (selector.startsWith(".")) {
            theme = selector.slice(1);
          }

          if (theme) {
            if (!result[theme]) {
              result[theme] = {};
            }

            rule.walkDecls((decl) => {
              if (decl.prop.startsWith("--")) {
                const varName = decl.prop.slice(2);
                result[theme][varName] = decl.value.trim();
              }
            });
          }
        });
      }
    });
  } catch (error) {
    return null;
  }

  return result;
}

const getContrastCssVars = (cssVars) => {
  const result = {};

  // Common Tailwind shade numbers
  const validShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Regex to match color-shade pattern: ends with dash + number
  const colorShadePattern = /^(.+)-(\d+)$/;

  Object.keys(cssVars).forEach((themeName) => {
    const themeVars = cssVars[themeName];
    const colorVars = {};

    Object.keys(themeVars).forEach((varName) => {
      const match = varName.match(colorShadePattern);

      if (match) {
        const [, colorName, shadeStr] = match;
        const shade = parseInt(shadeStr, 10);
        const value = themeVars[varName];

        // Only include if it's a valid Tailwind shade AND the value is actually a color
        if (validShades.includes(shade) && isColor(value)) {
          colorVars[varName] = value;
        }
      }
    });

    result[themeName] = colorVars;
  });

  return result;
};

function generateContrastColors(colorShadeVars) {
  const result = {};

  Object.keys(colorShadeVars).forEach((themeName) => {
    const themeColors = colorShadeVars[themeName];
    const contrastVars = {};

    Object.keys(themeColors).forEach((varName) => {
      const colorValue = themeColors[varName];
      const contrastColor = getContrastColor(colorValue);

      // Create the contrast variable name: neutral-50 -> on-neutral-50
      contrastVars[`on-${varName}`] = contrastColor;
    });

    result[themeName] = contrastVars;
  });

  return result;
}

const autoContrast = plugin.withOptions((options = {}) => {
  return function ({ addBase }) {
    try {
      const cwd = typeof options.cwd === "string" ? options.cwd : process.cwd();

      const discoveredCssFile = getTailwindCssFile(cwd);
      const cssFilePath = options.cssFile || discoveredCssFile;

      if (!cssFilePath) {
        return;
      }

      const absoluteCssPath = path.isAbsolute(cssFilePath)
        ? cssFilePath
        : path.resolve(cwd, cssFilePath);

      let rawCss;
      try {
        rawCss = fs.readFileSync(absoluteCssPath, "utf8");
      } catch (_error) {
        return;
      }

      const cssVars = readCssVars(rawCss);
      if (!cssVars) {
        return;
      }

      const colorShadeVars = getContrastCssVars(cssVars);
      const contrastColors = generateContrastColors(colorShadeVars);

      Object.keys(contrastColors).forEach((themeName) => {
        const themeContrastVars = contrastColors[themeName];
        if (!themeContrastVars || Object.keys(themeContrastVars).length === 0) {
          return;
        }

        const cssVarsWithPrefix = {};
        Object.entries(themeContrastVars).forEach(([varName, value]) => {
          cssVarsWithPrefix[`--${varName}`] = value;
        });

        if (themeName === "light") {
          addBase({
            ":root": cssVarsWithPrefix,
          });
        } else {
          addBase({
            [`.${themeName}`]: cssVarsWithPrefix,
          });
        }
      });
    } catch (_e) {
      // Fail silently to avoid breaking Tailwind IntelliSense or builds
      return;
    }
  };
});

module.exports = autoContrast;
