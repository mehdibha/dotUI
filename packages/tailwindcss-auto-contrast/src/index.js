const plugin = require("tailwindcss/plugin");
const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const DEFAULT_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
  "storybook-static",
  "coverage",
];

function toArray(maybeArray) {
  if (!maybeArray) return [];
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

function normalizePath(p) {
  try {
    return path.normalize(p);
  } catch (_e) {
    return p;
  }
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (_e) {
    return false;
  }
}

function dirExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (_e) {
    return false;
  }
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (_e) {
    return null;
  }
}

function hasTailwindImport(rawCss) {
  if (typeof rawCss !== "string") return false;
  return (
    rawCss.includes(`@import "tailwindcss"`) ||
    rawCss.includes(`@import 'tailwindcss'`) ||
    /@import\s+tailwindcss/i.test(rawCss)
  );
}

function log(level, message, detail) {
  const prefix = "[tailwindcss-auto-contrast]";
  const body = detail ? `${message} ${detail}` : message;
  switch (level) {
    case "error":
      console.error(`${prefix} ${body}`);
      break;
    case "warn":
      console.warn(`${prefix} ${body}`);
      break;
    default:
      // silent
      break;
  }
}

function detectRootStylesheet({ cwd, cssFile, source, logLevel }) {
  // 1) Explicit cssFile wins
  if (cssFile) {
    const abs = path.isAbsolute(cssFile) ? cssFile : path.resolve(cwd, cssFile);
    if (!fileExists(abs)) {
      log(
        logLevel,
        "The provided cssFile does not exist:",
        `\n- Given: ${cssFile}\n- Resolved: ${abs}`,
      );
      return null;
    }
    const raw = readFileSafe(abs);
    if (!hasTailwindImport(raw)) {
      log(
        logLevel,
        'The provided cssFile does not contain a Tailwind import (@import "tailwindcss").',
        `\n- Path: ${abs}`,
      );
    }
    return abs;
  }

  // 2) Source search (directory, glob, or file)
  const envCssFile =
    process.env.TW_AUTOCONTRAST_CSS_FILE ||
    process.env.TAILWIND_AUTOCONTRAST_CSS_FILE;
  if (envCssFile && !cssFile) {
    const abs = path.isAbsolute(envCssFile)
      ? envCssFile
      : path.resolve(cwd, envCssFile);
    if (fileExists(abs)) return abs;
  }

  const envSourceRaw =
    process.env.TW_AUTOCONTRAST_SOURCE ||
    process.env.TAILWIND_AUTOCONTRAST_SOURCE;
  const allSources = [
    ...toArray(source),
    ...(envSourceRaw ? envSourceRaw.split(",").map((s) => s.trim()) : []),
  ].filter(Boolean);

  const tryFiles = [];

  const addMatchesFrom = (base, patterns) => {
    try {
      const matches = fg.globSync(patterns, {
        cwd: base,
        deep: 6,
        ignore: DEFAULT_IGNORE,
        absolute: true,
      });
      for (const m of matches) tryFiles.push(m);
    } catch (_e) {
      // ignore
    }
  };

  for (const entry of allSources) {
    const normalized = normalizePath(entry);

    const absFile = path.isAbsolute(normalized)
      ? normalized
      : path.resolve(cwd, normalized);

    if (fileExists(absFile)) {
      tryFiles.push(absFile);
      continue;
    }

    // If a directory, search within
    if (dirExists(absFile)) {
      addMatchesFrom(absFile, ["**/*.css", "**/*.scss"]);
      continue;
    }

    // Otherwise, treat as a glob rooted at cwd
    addMatchesFrom(cwd, [normalized]);
  }

  // 3) Fallback: search from cwd
  if (tryFiles.length === 0) {
    try {
      const matches = fg.globSync(["**/*.css", "**/*.scss"], {
        cwd,
        deep: 6,
        ignore: DEFAULT_IGNORE,
        absolute: true,
      });
      for (const m of matches) tryFiles.push(m);
    } catch (_e) {
      // ignore
    }
  }

  for (const filePath of tryFiles) {
    const raw = readFileSafe(filePath);
    if (hasTailwindImport(raw)) {
      return filePath;
    }
  }

  log(
    logLevel,
    'Could not locate a Tailwind root stylesheet. The plugin looks for a CSS file that contains @import "tailwindcss".',
    `\n- Working directory: ${cwd}\n- You can set options.cssFile, options.source, or environment variables TW_AUTOCONTRAST_CSS_FILE / TW_AUTOCONTRAST_SOURCE.`,
  );
  return null;
}

function isColor(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return true;
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/i.test(trimmed))
    return true;
  if (
    /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/i.test(trimmed)
  )
    return true;
  if (/^(lab|lch|color|oklab|oklch|hwb)\s*\(/i.test(trimmed)) return true;
  if (/^var\s*\(\s*--[\w-]+\s*(,.*?)?\s*\)$/i.test(trimmed)) return true;
  return false;
}

function parseColorToRgb(colorValue) {
  if (!colorValue || typeof colorValue !== "string") return null;
  const trimmed = colorValue.trim();
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
  const hslMatch = trimmed.match(
    /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*[\d.]+)?\s*\)$/i,
  );
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
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
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function calculateContrastRatio(luminance1, luminance2) {
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
  const blackLuminance = 0;
  const whiteLuminance = 1;
  const contrastWithBlack = calculateContrastRatio(
    colorLuminance,
    blackLuminance,
  );
  const contrastWithWhite = calculateContrastRatio(
    colorLuminance,
    whiteLuminance,
  );
  return contrastWithBlack > contrastWithWhite ? "black" : "white";
}

function readCssVars(rawCss) {
  const result = {};
  try {
    const root = postcss.parse(rawCss);
    root.walkRules((rule) => {
      const selector = rule.selector && rule.selector.trim();
      let theme = null;
      if (selector === ":root") {
        theme = "light";
      } else if (selector === ".dark" || selector === ":root.dark") {
        theme = "dark";
      } else if (selector && selector.startsWith(".")) {
        theme = selector.slice(1);
      }
      if (theme) {
        if (!result[theme]) result[theme] = {};
        rule.walkDecls((decl) => {
          if (decl.prop && decl.prop.startsWith("--")) {
            const varName = decl.prop.slice(2);
            result[theme][varName] = (decl.value || "").trim();
          }
        });
      }
    });
    root.walkAtRules("layer", (atRule) => {
      if (atRule.params === "base") {
        atRule.walkRules((rule) => {
          const selector = rule.selector && rule.selector.trim();
          let theme = null;
          if (selector === ":root") {
            theme = "light";
          } else if (selector === ".dark" || selector === ":root.dark") {
            theme = "dark";
          } else if (selector && selector.startsWith(".")) {
            theme = selector.slice(1);
          }
          if (theme) {
            if (!result[theme]) result[theme] = {};
            rule.walkDecls((decl) => {
              if (decl.prop && decl.prop.startsWith("--")) {
                const varName = decl.prop.slice(2);
                result[theme][varName] = (decl.value || "").trim();
              }
            });
          }
        });
      }
    });
  } catch (_error) {
    return null;
  }
  return result;
}

function getContrastCssVars(cssVars) {
  const result = {};
  const validShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const colorShadePattern = /^(.+)-(\d+)$/;
  Object.keys(cssVars).forEach((themeName) => {
    const themeVars = cssVars[themeName];
    const colorVars = {};
    Object.keys(themeVars).forEach((varName) => {
      const match = varName.match(colorShadePattern);
      if (match) {
        const shade = parseInt(match[2], 10);
        const value = themeVars[varName];
        if (validShades.includes(shade) && isColor(value)) {
          colorVars[varName] = value;
        }
      }
    });
    result[themeName] = colorVars;
  });
  return result;
}

function generateContrastColors(colorShadeVars) {
  const result = {};
  Object.keys(colorShadeVars).forEach((themeName) => {
    const themeColors = colorShadeVars[themeName];
    const contrastVars = {};
    Object.keys(themeColors).forEach((varName) => {
      const colorValue = themeColors[varName];
      const contrastColor = getContrastColor(colorValue);
      contrastVars[`on-${varName}`] = contrastColor;
    });
    result[themeName] = contrastVars;
  });
  return result;
}

const autoContrast = plugin.withOptions((options = {}) => {
  return function ({ addBase }) {
    const logLevel = options.logLevel === "silent" ? "silent" : "warn";
    try {
      const cwd = typeof options.cwd === "string" ? options.cwd : process.cwd();
      const cssFilePath = detectRootStylesheet({
        cwd,
        cssFile: options.cssFile,
        source: options.source,
        logLevel,
      });
      if (!cssFilePath) return;

      const rawCss = readFileSafe(cssFilePath);
      if (rawCss == null) {
        log(
          logLevel,
          "Failed to read the root stylesheet:",
          `\n- Path: ${cssFilePath}`,
        );
        return;
      }

      const cssVars = readCssVars(rawCss);
      if (!cssVars) {
        log(
          logLevel,
          "Failed to parse CSS variables from the root stylesheet.",
        );
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
    } catch (e) {
      log(
        "warn",
        "An unexpected error occurred while running tailwindcss-auto-contrast. The plugin will continue silently.",
        `\n- Error: ${e && e.message ? e.message : String(e)}`,
      );
      return;
    }
  };
});

module.exports = autoContrast;
