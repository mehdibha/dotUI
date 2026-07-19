/**
 * CSS emitters for the "Open in v0" showcase bundle.
 *
 * v0 strips a registry item's structured `css` / `cssVars` fields, so the theme
 * has to ship as real files. These build the two dynamic pieces:
 *   - `colors.css`  — the preset-resolved primitive ramps (`:root` + `.dark`).
 *     Everything else (semantic `@theme` layer, utilities, plugins) is static
 *     and ships verbatim from the mirrored `registry/base/*.css` files.
 *   - `globals.css` — the Tailwind v4 entry the project's layout imports.
 *
 * Pure JS — safe to import in a route handler.
 */

import {
  ACCENT_PRIMARY_SEMANTICS,
  DEFAULT_COLOR_CONFIG,
  emitCss,
  emitPrimitivesCss,
  resolveColorConfig,
} from '@/registry/theme'

import type { PublishPreset } from './types'

/**
 * The preset-resolved primitive layer as a standalone `colors.css` — `:root`
 * (light) + `.dark`, each an independent engine pass carrying the ramps,
 * alpha twins, solved `--on-*` labels, and chart colors.
 */
export function emitColorsCss(preset: PublishPreset): string {
  const config = preset.color ?? DEFAULT_COLOR_CONFIG
  const css = emitPrimitivesCss(resolveColorConfig(config))
  // The bundle's theme.css ships static (`--color-primary: var(--neutral-950)`
  // inside `@theme`); an accent-sourced primary re-points the cluster on plain
  // `:root`, which beats the layered `@theme` declarations at compile.
  if (config.primary !== 'accent') return css
  return `${css}\n${emitCss(ACCENT_PRIMARY_SEMANTICS, { selector: ':root' })}`
}

/**
 * The Tailwind v4 entry for the generated project. Static across presets — it
 * pulls in Tailwind, the fonts, and the mirrored registry stylesheet (which in
 * turn imports `base.css`, the preset `colors.css`, `theme.css`, and every
 * component's `styles.css`). `@source` globs make Tailwind scan the shipped
 * component + showcase sources. Lives at `src/app/globals.css`.
 */
export const BUNDLE_GLOBALS_CSS = `@import "tailwindcss";

@import "@fontsource-variable/geist";
@import "@fontsource/geist-mono";

@import "../registry/styles.css";

@source "../registry/**/*.{ts,tsx}";
@source "../components/**/*.{ts,tsx}";
@source "../modules/**/*.{ts,tsx}";
@source "./**/*.{ts,tsx}";

@theme {
\t--font-geist-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
\t--font-geist-mono: "Geist Mono", ui-monospace, monospace;
}
`
