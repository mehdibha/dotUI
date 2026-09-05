/**
 * Build the `registry:base` (a.k.a. "init") item that `shadcn init` consumes.
 *
 * Base CSS is emitted through shadcn's structured registry fields:
 *   - `cssVars.theme` -> `@theme inline`
 *   - `css`           -> imports, plugins, utilities, layers, selectors,
 *                        and runtime palette vars in `:root` / `.dark`
 *
 * Pure JS — no `ts-morph`, no React. Safe to import in route handlers.
 */

import {
  FONT_TOKEN_VARS,
  fontFamiliesFromTokens,
  googleFontsUrl,
} from "@/lib/fonts"
import {
  resolveColorConfig,
  resolveTarget,
  resolveTokenValue,
  semanticsFor,
} from "@/registry/theme"
import type { Density, RegistryItem } from "@/registry/types"

// Relative import: the publisher sits in vite.config's module graph, where
// value imports through the `@/` alias break vitest/vite startup.
import { STYLE_VAR_DEFAULTS } from "../registry/__generated__/style-var-defaults"
import { fontItemNamesForTokens } from "./emit-font"
import { buildStyleVarMap } from "./resolve-classes"
import type { PublishPreset } from "./types"

type RegistryCssFields = Pick<RegistryItem, "css" | "cssVars">

export interface EmitThemeInput {
  /** Structured shadcn registry CSS fields generated from base/*.css. */
  baseRegistryCss: RegistryCssFields
  /** The preset to bake into the init item. */
  preset: PublishPreset
  /** Encoded preset string — gets put in `config.registries.@dotui` as `?preset=…`. */
  encodedPreset?: string
  /** Root URL of the deployed registry, e.g. `https://dotui.com`. */
  registryRoot: string
}

export const DEFAULT_DEPENDENCIES = [
  "tailwind-variants",
  "react-aria-components",
  "tailwindcss-react-aria-components",
  "tw-animate-css",
  // The init css emits `@plugin 'tailwindcss-with'` — without the package the
  // consumer's first Tailwind build fails.
  "tailwindcss-with",
]

export const CN_UTILS_TS = `import { cn as cnBase } from "tailwind-variants";

// Narrowed to \`string\`: React Aria className render props reject \`undefined\`.
export const cn = (...classes: Parameters<typeof cnBase>): string =>
  cnBase(...classes) ?? "";
`

/**
 * Map the preset's density key to a `:root` value. dotui's default density
 * is `default`, so an empty value omits the declaration.
 */
function densityRootValue(density: Density): string | undefined {
  if (density === "default") return undefined
  return density
}

/** Mirror of `resolveCssValue` in lib/styles.tsx (not importable here — React).
 *  Distinct from the imported `resolveTokenValue`, which resolves a
 *  `SemanticToken`; this takes a raw token string. */
function resolveCssValue(value: string): string {
  return value.startsWith("--") ? `var(${value})` : value
}

/**
 * Split the preset's global tokens by where the export must carry them:
 * - `theme`: names the shipped `@theme` block declares (fonts, cursors, the
 *   radius rungs). It renders `@theme inline`, which bakes values into
 *   utilities, so a `:root` override would be ignored — re-point the theme.
 * - `root`: everything else lands on `:root`, same as the live provider —
 *   minus builder-only indirection (`--radius-control` and friends), which
 *   the class rewriter has already resolved into plain utilities.
 */
function splitPresetTokens(
  preset: PublishPreset,
  themeNames: Set<string>,
): { theme: Record<string, string>; root: Record<string, string> } {
  const theme: Record<string, string> = {}
  const root: Record<string, string> = {}
  const density = densityRootValue(preset.density)
  if (density) root["--dotui-density"] = preset.density
  const tokens = preset.tokens ?? {}
  const resolved = buildStyleVarMap({ ...STYLE_VAR_DEFAULTS, ...tokens })
  for (const [key, value] of Object.entries(tokens)) {
    const name = key.startsWith("--") ? key : `--${key}`
    if (themeNames.has(name)) theme[name] = resolveCssValue(value)
    else if (!resolved.has(name)) root[name] = resolveCssValue(value)
  }
  return { theme, root }
}

export function emitInitItem(input: EmitThemeInput): RegistryItem {
  const { baseRegistryCss, preset, encodedPreset, registryRoot } = input
  const { css, cssVars } = mergePresetCssFields(baseRegistryCss, preset)
  // One `registry:font` item per font token the preset sets. shadcn installs
  // the face per framework (next/font on Next.js, @fontsource elsewhere) and
  // sets the token variable — see emit-font.ts for why not a CSS `@import`.
  const fontDependencies = fontItemNamesForTokens(preset.tokens ?? {}).map(
    (name) => `${registryRoot}/r/${name}`,
  )

  // Intentionally minimal `config` block:
  // - No `tailwind.css` or `tailwind.baseColor` — shadcn detects these from
  //   the project (e.g. src/app/globals.css for a Next.js app dir). Hard-
  //   coding `src/styles/globals.css` here would override a correct
  //   detection and cause ENOENT when shadcn tries to merge cssVars into a
  //   file that doesn't exist.
  // - `cssVariables: true` because dotUI installs its design tokens through
  //   this registry item's structured CSS fields.
  // - The `@dotui` registries mapping is preserved as a convenience for
  //   shadcn versions that DO merge a `registry:base`'s config block, but
  //   we don't rely on it: per-component `registryDependencies` are emitted
  //   as absolute URLs by the per-component publisher.
  const config = {
    style: "default",
    tailwind: {
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      utils: "@/lib/utils",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    registries: {
      "@dotui": registryConfigUrl(registryRoot, encodedPreset),
    },
  }

  const item = {
    name: "dotui",
    // `registry:base` is the init payload type shadcn uses for project
    // config updates such as `components.json.registries`.
    type: "registry:base",
    extends: "none",
    dependencies: DEFAULT_DEPENDENCIES,
    // shadcn's `cn` utils sit in a 4xx-gated path under v4 Tailwind, so we ship our own copy
    // in `files[]` rather than declaring a registry dependency. Fonts are the
    // only registry deps here.
    registryDependencies: fontDependencies,
    ...(css ? { css } : {}),
    ...(cssVars ? { cssVars } : {}),
    files: [
      {
        type: "registry:lib",
        path: "lib/utils.ts",
        target: "src/lib/utils.ts",
        content: CN_UTILS_TS,
      },
    ],
    config,
  }

  return item as unknown as RegistryItem
}

function registryConfigUrl(
  registryRoot: string,
  encodedPreset: string | undefined,
): string {
  return `${registryRoot}/r/{name}?preset=${encodedPreset ?? ""}`
}

type EngineTheme = ReturnType<typeof resolveColorConfig>

/** Flatten one engine mode into primitive var entries, mirroring
 *  `emitPrimitivesCss` naming: ramp steps, alpha twins, solved on-* labels. */
function modeToVars(mode: EngineTheme["light"]): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [palette, scale] of Object.entries(mode.scales)) {
    for (const [step, value] of Object.entries(scale)) {
      vars[`--${palette}-${step}`] = value
    }
  }
  for (const [palette, twin] of Object.entries(mode.alphas)) {
    for (const [step, value] of Object.entries(twin)) {
      vars[`--${palette}-a${step}`] = value
    }
  }
  for (const [palette, on] of Object.entries(mode.on)) {
    vars[`--on-${palette}-700`] = on["700"]
    vars[`--on-${palette}-800`] = on["800"]
  }
  return vars
}

function chartVars(
  set: EngineTheme["charts"]["light"],
): Record<string, string> {
  const vars: Record<string, string> = {}
  set.categorical.forEach((color, i) => {
    vars[`--chart-${i + 1}`] = color
  })
  return vars
}

export function mergePresetCssFields(
  base: RegistryCssFields,
  preset: PublishPreset,
  options: {
    /**
     * Ship the preset's Google-hosted faces as a CSS `@import url()`. Only for
     * renderers that hoist `@import` keys to the top of a real stylesheet (the
     * v0 globals.css). The init item ships `registry:font` items instead —
     * shadcn's CSS updater would place this import after `@import
     * "tailwindcss"`, where bundlers drop it.
     */
    googleFontsImport?: boolean
  } = {},
): RegistryCssFields {
  const css = cloneRecord(base.css) ?? {}
  mergeCssVarsIntoCssRule(css, ":root", base.cssVars?.light)
  mergeCssVarsIntoCssRule(css, ".dark", base.cssVars?.dark)

  const cssVars = cloneThemeCssVars(base.cssVars)

  // A custom color recipe regenerates the full primitive layer — ramps, alpha
  // twins, solved on-* labels, and chart colors — overriding the static base
  // palette in :root (light) and .dark (an independent engine pass).
  if (preset.color) {
    const theme = resolveColorConfig(preset.color)
    css[":root"] = {
      ...(isPlainCssObject(css[":root"]) ? css[":root"] : {}),
      ...modeToVars(theme.light),
      ...chartVars(theme.charts.light),
    }
    css[".dark"] = {
      ...(isPlainCssObject(css[".dark"]) ? css[".dark"] : {}),
      ...modeToVars(theme.dark),
      ...chartVars(theme.charts.dark),
    }
  }

  // The shipped `@theme` block is resolved from the typed vocabulary, honoring
  // the preset's primary source (`--color-primary: var(--accent-700)` when the
  // primary draws from the accent ramp) and any per-token overrides. Per-mode
  // targets take their light value in `@theme` and re-point on `.dark`.
  const themeVars = (cssVars.theme ??= {})
  const darkRepoints: Record<string, string> = {}
  for (const [name, token] of Object.entries(semanticsFor(preset.color))) {
    themeVars[`--${name}`] = resolveTokenValue(token)
    if ("light" in token.target)
      darkRepoints[`--${name}`] = resolveTarget(token.target.dark)
  }
  if (Object.keys(darkRepoints).length > 0) {
    css[".dark"] = {
      ...(isPlainCssObject(css[".dark"]) ? css[".dark"] : {}),
      ...darkRepoints,
    }
  }

  const split = splitPresetTokens(
    preset,
    new Set([...FONT_TOKEN_VARS, ...Object.keys(base.cssVars?.theme ?? {})]),
  )
  if (Object.keys(split.root).length > 0) {
    css[":root"] = {
      ...(isPlainCssObject(css[":root"]) ? css[":root"] : {}),
      ...split.root,
    }
  }
  // The faces themselves come from `registry:font` items (init) or, on
  // request, a Google Fonts import (v0).
  Object.assign(themeVars, split.theme)
  if (options.googleFontsImport) {
    const fontFamilies = fontFamiliesFromTokens(preset.tokens ?? {})
    if (fontFamilies.length > 0) {
      css[`@import url('${googleFontsUrl(fontFamilies)}')`] = {}
    }
  }

  return {
    ...(css && Object.keys(css).length > 0 ? { css } : {}),
    ...(Object.keys(cssVars).length > 0 ? { cssVars } : {}),
  }
}

function cloneThemeCssVars(
  cssVars: RegistryCssFields["cssVars"],
): NonNullable<RegistryCssFields["cssVars"]> {
  return {
    ...(cssVars?.theme ? { theme: { ...cssVars.theme } } : {}),
  }
}

function mergeCssVarsIntoCssRule(
  css: NonNullable<RegistryCssFields["css"]>,
  selector: string,
  vars: Record<string, string> | undefined,
): void {
  if (!vars || Object.keys(vars).length === 0) return

  const target = isPlainCssObject(css[selector]) ? css[selector] : {}
  for (const [key, value] of Object.entries(vars)) {
    target[key.startsWith("--") ? key : `--${key}`] = value
  }
  css[selector] = target
}

function cloneRecord<T>(value: T): T {
  return value ? JSON.parse(JSON.stringify(value)) : value
}

function isPlainCssObject(
  value: unknown,
): value is NonNullable<RegistryItem["css"]> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
