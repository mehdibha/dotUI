/**
 * Resolve a {@link ColorConfig} into per-mode primitive ramps and emit them as
 * `base/colors.css`.
 *
 * The `@dotui/colors` kernel generates one perceptual, background-independent
 * ramp per palette (mode-agnostic). dotUI keeps today's structure — per-mode
 * primitives in `:root` / `.dark`, mode-agnostic semantic tokens — so dark mode
 * is derived by **reversing the lightness ladder** of each ramp (`50` ↔ `950`).
 * This keeps direct primitive utilities (`bg-neutral-300`) mode-correct, which a
 * single shared ramp would not. The `--on-*` foregrounds are still produced by
 * the `tailwindcss-autocontrast` plugin at Tailwind-compile.
 */

import { createTheme, oklchCss, onBlackWhite, toOklch } from '@dotui/colors'

import { GENERATIVE_ALGORITHMS, type ColorConfig } from './color-config'
import {
  ACCENT_KERNEL_NAME,
  fromKernelPaletteName,
  PALETTE_ORDER,
  STATUS_PALETTES,
} from './palettes'

export type Ramp = Record<string, string>

export interface ResolvedPalettes {
  steps: string[]
  light: Record<string, Ramp>
  dark: Record<string, Ramp>
}

/** Reverse a ramp's value ladder: step `50` takes `950`'s value, etc. (dark mode). */
function reverseRamp(scale: Ramp): Ramp {
  const steps = Object.keys(scale)
  const reversed = Object.values(scale).reverse()
  const out: Ramp = {}
  steps.forEach((step, index) => {
    const value = reversed[index]
    if (value !== undefined) out[step] = value
  })
  return out
}

/**
 * Widen a ramp's lightness range. The kernel's perceptual anchors bottom out
 * near L 0.24 (great for colored ramps), but dotUI's neutral surfaces want the
 * full near-white → near-black span so the (reversed) dark background reads as
 * near-black rather than grey.
 */
function stretchLightness(scale: Ramp, min: number, max: number): Ramp {
  const lightnesses = Object.values(scale).map((value) => toOklch(value).l)
  const lo = Math.min(...lightnesses)
  const hi = Math.max(...lightnesses)
  const span = hi - lo || 1
  const out: Ramp = {}
  for (const [step, value] of Object.entries(scale)) {
    const { l, c, h } = toOklch(value)
    const t = (l - lo) / span
    // Smoothstep S-curve: cluster the lightest + darkest steps so surface tokens
    // (bg / card / muted) sit close together at each end — tight, near-black dark
    // surfaces and near-white light surfaces — while mid steps stay spread.
    const eased = t * t * (3 - 2 * t)
    out[step] = oklchCss({ l: min + eased * (max - min), c, h })
  }
  return out
}

/** Near-black dark surface ↔ near-white light surface for the neutral backbone. */
const NEUTRAL_L_MIN = 0.13
const NEUTRAL_L_MAX = 0.985

export function resolveColorConfig(config: ColorConfig): ResolvedPalettes {
  const { seeds, algorithm, steps } = config

  // Defense-in-depth: the codec sanitizes presets, but `resolveColorConfig` also runs in
  // the publisher path on decoded request data. Reject a non-generative algorithm with a
  // clear error instead of throwing deep in the kernel's zod parse (a `fixed` recipe would).
  if (!(GENERATIVE_ALGORITHMS as readonly string[]).includes(algorithm)) {
    throw new Error(
      `resolveColorConfig: "${algorithm}" is not a seed-generative algorithm (needs literal ramps).`,
    )
  }

  // The kernel requires a `primary` palette (the brand); dotUI names it `accent`.
  // Always generate every status palette (a missing seed falls back to the kernel's
  // built-in) so a partial config never leaves a stale base ramp downstream.
  const palettes: Record<string, string | boolean> = {
    [ACCENT_KERNEL_NAME]: seeds.accent,
    neutral: seeds.neutral,
  }
  for (const name of STATUS_PALETTES) {
    palettes[name] = seeds[name] ?? true
  }

  // algorithm is a runtime-validated discriminant the kernel's zod schema checks. The object
  // targets the kernel's `BaseThemeOptions` view (no cast); knobs are forwarded verbatim and
  // each producer's schema keeps only the ones it understands.
  const theme = createTheme({
    algorithm,
    palettes,
    steps,
    modes: { light: true },
    ...config.knobs,
  })

  const lightMode = theme.light
  if (!lightMode)
    throw new Error('resolveColorConfig: kernel produced no `light` mode')

  // Rename the kernel's `primary` ramp back to dotUI's `accent`; widen the
  // neutral backbone so dark surfaces (the reversed ramp) reach near-black.
  const light: Record<string, Ramp> = {}
  for (const [name, scale] of Object.entries(lightMode.scales)) {
    const key = fromKernelPaletteName(name)
    light[key] =
      key === 'neutral'
        ? stretchLightness(scale, NEUTRAL_L_MIN, NEUTRAL_L_MAX)
        : scale
  }

  const dark: Record<string, Ramp> = {}
  for (const [name, scale] of Object.entries(light))
    dark[name] = reverseRamp(scale)

  return { steps: Object.keys(light.neutral ?? {}), light, dark }
}

function orderedNames(palettes: Record<string, Ramp>): string[] {
  const ordered = PALETTE_ORDER.filter((name) => name in palettes)
  const extra = Object.keys(palettes)
    .filter((name) => !(PALETTE_ORDER as readonly string[]).includes(name))
    .sort()
  return [...ordered, ...extra]
}

function emitBlock(
  out: string[],
  palettes: Record<string, Ramp>,
  names: string[],
): void {
  names.forEach((name, index) => {
    const ramp = palettes[name]
    if (!ramp) return
    for (const [step, value] of Object.entries(ramp)) {
      out.push(`\t--${name}-${step}: ${value};`)
    }
    if (index < names.length - 1) out.push('')
  })
}

/** Append `--on-<palette>-<step>: black|white` per ramp step (matches the autocontrast plugin). */
function emitOnBlock(
  out: string[],
  palettes: Record<string, Ramp>,
  names: string[],
): void {
  for (const name of names) {
    const ramp = palettes[name]
    if (!ramp) continue
    for (const [step, value] of Object.entries(ramp)) {
      out.push(`\t--on-${name}-${step}: ${onBlackWhite(value)};`)
    }
  }
}

export interface EmitPrimitivesOptions {
  /**
   * Also emit `--on-<palette>-<step>` foregrounds (black/white). OFF for the generated
   * `base/colors.css` — the `tailwindcss-autocontrast` plugin derives `--on-*` at
   * Tailwind-compile from the static ramps. ON for the live-preview `<style>`, whose runtime
   * ramp overrides would otherwise leave the baked `--on-*` stale (unreadable text-on-color).
   */
  onColors?: boolean
  /**
   * Selector for the light-mode block (default `:root`). Pass a subtree selector (e.g.
   * `[data-dotui-scope="x"]`) to override the primitive ramps on a scope rather than globally
   * — see `DesignSystemProvider`'s `scoped` mode. The default `:root` also carries the
   * `base/colors.css` banner + `--radius-factor: 1` reset; a custom selector omits both.
   */
  lightSelector?: string
  /** Selector for the dark-mode (reversed) block (default `.dark`). */
  darkSelector?: string
}

/** Render resolved ramps as the `base/colors.css` content (`:root` light + `.dark` reversed). */
export function emitPrimitivesCss(
  resolved: ResolvedPalettes,
  options: EmitPrimitivesOptions = {},
): string {
  const { onColors, lightSelector = ':root', darkSelector = '.dark' } = options
  const isRoot = lightSelector === ':root'
  const names = orderedNames(resolved.light)
  const out: string[] = []
  if (isRoot) {
    out.push(
      '/* AUTO-GENERATED — do not edit. Run `pnpm build:registry`. */',
      '/* Primitive ramps generated from DEFAULT_COLOR_CONFIG (see @/registry/theme). */',
      '',
    )
  }
  out.push(`${lightSelector} {`)
  // `--radius-factor` belongs to the global reset only; a scope inherits (or overrides) it.
  if (isRoot) out.push('\t--radius-factor: 1;', '')
  emitBlock(out, resolved.light, names)
  if (onColors) {
    out.push('')
    emitOnBlock(out, resolved.light, names)
  }
  out.push('}', '', `${darkSelector} {`)
  emitBlock(out, resolved.dark, names)
  if (onColors) {
    out.push('')
    emitOnBlock(out, resolved.dark, names)
  }
  out.push('}')
  return `${out.join('\n')}\n`
}
