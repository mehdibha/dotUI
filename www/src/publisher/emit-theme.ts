/**
 * Build the `registry:base` (a.k.a. "init") item that `shadcn init` consumes.
 *
 * Base CSS is emitted through shadcn's structured registry fields, in the
 * same shape shadcn's own themes use:
 *   - `cssVars.light` / `.dark` -> `:root` / `.dark` — every semantic token
 *                                  as a literal `oklch()` per mode, plus
 *                                  radius, density, and chart slots
 *   - `cssVars.theme`           -> `@theme inline` — the Tailwind vocabulary
 *                                  (`--color-bg: var(--bg)`, radius rungs, fonts)
 *   - `css`                     -> imports, plugins, utilities, layers, selectors
 *
 * The primitive ramps never ship: users own ~90 readable semantic values,
 * not the generator's intermediate output.
 *
 * Pure JS — no `ts-morph`, no React. Safe to import in route handlers.
 */

import {
  FONT_TOKEN_VARS,
  fontFamiliesFromTokens,
  googleFontsUrl,
} from "@/lib/fonts"
import {
  DEFAULT_COLOR_CONFIG,
  resolveColorConfig,
  semanticLiterals,
  semanticsFor,
} from "@/registry/theme"
import type { RegistryItem } from "@/registry/types"

import { fontItemNamesForTokens } from "./emit-font"
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

/** Base radius length; presets override it through `tokens["--radius"]`. */
const DEFAULT_RADIUS = "0.625rem"

/** Mirror of `resolveCssValue` in lib/styles.tsx (not importable here — React). */
function resolveCssValue(value: string): string {
  return value.startsWith("--") ? `var(${value})` : value
}

/**
 * Global preset tokens (radius, density, cursors, …) for `:root`.
 * `componentParams` are inlined into component classes at build, so they're
 * not written here. Font tokens are excluded: the shipped theme renders
 * `@theme inline`, which bakes values into utilities, so a `:root` override
 * would be ignored — they re-point the `@theme` vocabulary instead.
 */
function presetRootVars(preset: PublishPreset): Record<string, string> {
  const vars: Record<string, string> = { "--radius": DEFAULT_RADIUS }
  // dotui's default density is `default`, so it needs no declaration.
  if (preset.density !== "default") vars["--dotui-density"] = preset.density
  const fontVars = new Set<string>(FONT_TOKEN_VARS)
  for (const [key, value] of Object.entries(preset.tokens ?? {})) {
    if (fontVars.has(key)) continue
    vars[key.startsWith("--") ? key : `--${key}`] = resolveCssValue(value)
  }
  return vars
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

/** `color-fg-on-primary` → `--fg-on-primary`: the `:root` name behind a token. */
function rootVar(tokenName: string): string {
  return `--${tokenName.replace(/^color-/, "")}`
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
  const theme = { ...base.cssVars?.theme }
  const light = { ...base.cssVars?.light, ...presetRootVars(preset) }
  const dark = { ...base.cssVars?.dark }

  // The color layer: every semantic token flattened to a literal per mode,
  // named shadcn-style in `:root`/`.dark` and aliased into the vocabulary.
  const engine = resolveColorConfig(preset.color ?? DEFAULT_COLOR_CONFIG)
  const literals = semanticLiterals(semanticsFor(preset.color), engine)
  for (const [name, value] of Object.entries(literals.light)) {
    theme[`--${name}`] = `var(${rootVar(name)})`
    light[rootVar(name)] = value
  }
  for (const [name, value] of Object.entries(literals.dark)) {
    dark[rootVar(name)] = value
  }
  engine.charts.light.categorical.forEach((color, i) => {
    light[`--chart-${i + 1}`] = color
  })
  engine.charts.dark.categorical.forEach((color, i) => {
    dark[`--chart-${i + 1}`] = color
  })

  // Typography: re-point the `@theme` vocabulary at the preset's stacks. The
  // faces themselves come from `registry:font` items (init) or, on request,
  // a Google Fonts import (v0).
  for (const varName of FONT_TOKEN_VARS) {
    const stack = preset.tokens?.[varName]
    if (stack) theme[varName] = stack
  }
  if (options.googleFontsImport) {
    const fontFamilies = fontFamiliesFromTokens(preset.tokens ?? {})
    if (fontFamilies.length > 0) {
      css[`@import url('${googleFontsUrl(fontFamilies)}')`] = {}
    }
  }

  return {
    ...(Object.keys(css).length > 0 ? { css } : {}),
    cssVars: { theme, light, dark },
  }
}

function cloneRecord<T>(value: T): T {
  return value ? JSON.parse(JSON.stringify(value)) : value
}
