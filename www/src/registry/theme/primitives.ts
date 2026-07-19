/**
 * Resolve a {@link ColorConfig} into engine output and emit it as
 * `base/colors.css`.
 *
 * The `@dotui/colors` engine generates BOTH modes as independent passes
 * (no ladder reversal, no post-hoc lightness surgery) plus solved `on-*`
 * labels, alpha twins, and chart palettes. Emission routes light into
 * `:root`, dark into `.dark`; the semantic layer stays mode-agnostic.
 */

import {
  createTheme,
  STEPS,
  type Theme,
  type ThemeOptions,
} from '@dotui/colors'

import { type ColorConfig, colorConfigSchema } from './color-config'
import { PALETTE_ORDER } from './palettes'

export type Ramp = Record<string, string>

/** Convert the persisted config into engine options. */
export function themeOptionsFromConfig(config: ColorConfig): ThemeOptions {
  const options: ThemeOptions = { seeds: { accent: config.seeds.accent } }
  for (const name of [
    'neutral',
    'success',
    'warning',
    'danger',
    'info',
  ] as const) {
    const seed = config.seeds[name]
    if (seed) options.seeds[name] = seed
  }
  if (config.background) options.background = config.background
  if (config.vividness !== undefined) options.vividness = config.vividness
  if (config.hueShift !== undefined) options.hueShift = config.hueShift
  if (config.neutralTint !== undefined) options.neutralTint = config.neutralTint
  if (config.preserveSeed !== undefined)
    options.preserveSeed = config.preserveSeed
  return options
}

/**
 * Resolve a config through the engine. Validates first — this also runs in
 * the publisher path on decoded request data, where a clear error beats a
 * deep engine throw.
 */
export function resolveColorConfig(config: ColorConfig): Theme {
  const parsed = colorConfigSchema.parse(config)
  return createTheme(themeOptionsFromConfig(parsed))
}

export interface EmitPrimitivesOptions {
  /**
   * Selector for the light-mode block (default `:root`). Pass a subtree
   * selector (e.g. `[data-dotui-scope="x"]`) to override the primitives on a
   * scope rather than globally. The default `:root` also carries the
   * `base/colors.css` banner + `--radius-factor: 1` reset; a custom selector
   * omits both.
   */
  lightSelector?: string
  /** Selector for the dark-mode block (default `.dark`). */
  darkSelector?: string
  /** Emit `--<palette>-a<step>` alpha twins (default true). */
  alphas?: boolean
  /** Emit `--chart-N` categorical tokens per mode (default true). */
  charts?: boolean
}

function orderedNames(scales: Record<string, unknown>): string[] {
  const ordered = PALETTE_ORDER.filter((name) => name in scales)
  const extra = Object.keys(scales)
    .filter((name) => !(PALETTE_ORDER as readonly string[]).includes(name))
    .sort()
  return [...ordered, ...extra]
}

function emitModeBlock(
  out: string[],
  mode: Theme['light'],
  names: string[],
  alphas: boolean,
): void {
  names.forEach((name, index) => {
    const scale = mode.scales[name]
    if (!scale) return
    for (const step of STEPS) out.push(`\t--${name}-${step}: ${scale[step]};`)
    if (alphas) {
      const twin = mode.alphas[name]
      if (twin)
        for (const step of STEPS)
          out.push(`\t--${name}-a${step}: ${twin[step]};`)
    }
    const on = mode.on[name]
    if (on) {
      out.push(`\t--on-${name}-700: ${on['700']};`)
      out.push(`\t--on-${name}-800: ${on['800']};`)
    }
    if (index < names.length - 1) out.push('')
  })
}

/** Render an engine theme as the `base/colors.css` content. */
export function emitPrimitivesCss(
  theme: Theme,
  options: EmitPrimitivesOptions = {},
): string {
  const {
    lightSelector = ':root',
    darkSelector = '.dark',
    alphas = true,
    charts = true,
  } = options
  const isRoot = lightSelector === ':root'
  const names = orderedNames(theme.light.scales)
  const out: string[] = []
  if (isRoot) {
    out.push(
      '/* AUTO-GENERATED — do not edit. Run `pnpm build:registry`. */',
      '/* Primitive ramps generated from DEFAULT_COLOR_CONFIG (see @/registry/theme). */',
      '',
    )
  }
  const emitCharts = (set: { categorical: string[] }) => {
    out.push('')
    set.categorical.forEach((color, i) => {
      out.push(`\t--chart-${i + 1}: ${color};`)
    })
  }
  out.push(`${lightSelector} {`)
  if (isRoot) out.push('\t--radius-factor: 1;', '')
  emitModeBlock(out, theme.light, names, alphas)
  if (charts) emitCharts(theme.charts.light)
  out.push('}', '', `${darkSelector} {`)
  emitModeBlock(out, theme.dark, names, alphas)
  if (charts) emitCharts(theme.charts.dark)
  out.push('}')
  return `${out.join('\n')}\n`
}
