/**
 * The one generalized, registry-driven, background-independent orchestrator.
 *
 * Resolves palettes (primary required; neutral explicit-or-derived; status via
 * SEMANTIC_COLORS; custom catchall) and modes once, derives each mode's
 * background from the neutral seed, then loops modes × palettes calling the
 * registered producer. No per-algorithm branching.
 */

import { getProducer, type ModeCtx, produceValidated } from './producer'
import { registerBuiltins } from './producers'
import {
  type BaseThemeOptions,
  BUILTIN_SCHEMA_IDS,
  type CreateThemeOptions,
  createThemeOptionsSchema,
  customThemeOptionsSchema,
} from './schema'
import { computeAlphaColors } from './shared/alpha'
import { gamutMap, oklchCss, toOklch } from './shared/color'
import { DEFAULT_MODES, SCALE_STEPS, SEMANTIC_COLORS } from './shared/constants'
import type { ColorScale, Theme } from './shared/types'

interface ResolvedMode {
  isDark: boolean
  bgLightness: number
  palettes: Record<
    string,
    { seed?: string; ratios?: number[]; tones?: number[] }
  >
}

/** Resolve the per-palette base inputs: name → seed string (generative) or scale map (fixed). */
function resolvePalettes(
  palettes: Record<string, string | ColorScale | boolean>,
  isFixed: boolean,
): Map<string, string | ColorScale> {
  const out = new Map<string, string | ColorScale>()
  if (isFixed) {
    for (const [name, scale] of Object.entries(palettes)) {
      if (typeof scale === 'object') out.set(name, scale)
    }
    return out
  }
  const primary = palettes.primary
  // `neutral` is explicit-or-derived: a string seed wins, otherwise derive from the primary seed
  // (a non-string neutral — e.g. the catchall `true` — is not a usable seed, so fall back).
  const neutral =
    typeof palettes.neutral === 'string' ? palettes.neutral : primary
  if (typeof primary === 'string') out.set('primary', primary)
  if (typeof neutral === 'string') out.set('neutral', neutral)
  for (const [name, value] of Object.entries(palettes)) {
    if (name === 'primary' || name === 'neutral') continue
    if (value === true) {
      const def = SEMANTIC_COLORS[name]
      if (def) out.set(name, def)
    } else if (typeof value === 'string') {
      out.set(name, value)
    }
  }
  return out
}

function resolveMode(name: string, config: unknown): ResolvedMode {
  const isDarkByName = name.toLowerCase().includes('dark')
  if (config === true || config == null) {
    return {
      isDark: isDarkByName,
      bgLightness: isDarkByName ? 0.16 : 0.98,
      palettes: {},
    }
  }
  const c = config as {
    isDark?: boolean
    lightness?: number
    palettes?: ResolvedMode['palettes']
  }
  const isDark = c.isDark ?? isDarkByName
  return {
    isDark,
    bgLightness: c.lightness ?? (isDark ? 0.16 : 0.98),
    palettes: c.palettes ?? {},
  }
}

/** Mode background from the neutral seed at the mode's lightness anchor (lightly tinted). */
function deriveBackground(
  neutralSeed: string | undefined,
  bgLightness: number,
): string {
  if (!neutralSeed) return oklchCss({ l: bgLightness, c: 0, h: 0 })
  const { c, h } = toOklch(neutralSeed)
  return oklchCss(gamutMap({ l: bgLightness, c: Math.min(c, 0.01), h }))
}

/** Build the per-palette opts; each producer's zod schema strips the knobs it ignores. */
function buildPaletteOpts(
  name: string,
  input: string | ColorScale,
  opts: BaseThemeOptions,
  override: ResolvedMode['palettes'][string] | undefined,
): Record<string, unknown> {
  const seed = override?.seed ?? (typeof input === 'string' ? input : undefined)
  return {
    // Forward every validated knob; each producer's schema keeps only its own, so adding a
    // producer knob needs no edit here. Per-palette specifics + mode overrides win below.
    ...opts,
    seed,
    neutral: name === 'neutral',
    scale: typeof input === 'object' ? input : undefined,
    // the kernel maps contrast `saturation` (0–100) onto the producer's `chroma`
    chroma: opts.saturation != null ? opts.saturation / 100 : undefined,
    ratios: override?.ratios ?? opts.ratios,
    tones: override?.tones ?? opts.tones,
  }
}

/**
 * Create a theme. `algorithm` selects the producer (oklch is the recommended default).
 * Output: `Theme` — primitive ramps + paired on-* per palette, per mode.
 */
export function createTheme(
  options: CreateThemeOptions | BaseThemeOptions,
): Theme {
  registerBuiltins()
  let opts: BaseThemeOptions
  if ((BUILTIN_SCHEMA_IDS as readonly string[]).includes(options.algorithm)) {
    opts = createThemeOptionsSchema.parse(options)
  } else {
    // Throws the canonical "Unknown color algorithm" error (with the registered list) for
    // unregistered ids, BEFORE base validation — registration is the gate, not the union.
    getProducer(options.algorithm)
    // The catchall types extra knobs as `unknown`; producers re-validate them per palette
    // (produceValidated), so this widening cast is the one place the kernel trusts the registry.
    opts = customThemeOptionsSchema.parse(options) as BaseThemeOptions
  }
  const { algorithm } = opts
  const steps = opts.steps ?? [...SCALE_STEPS]
  const modes = opts.modes ?? DEFAULT_MODES
  const isFixed = algorithm === 'fixed'

  const baseInputs = resolvePalettes(opts.palettes, isFixed)
  const neutralRaw = baseInputs.get('neutral')
  const neutralBase =
    !isFixed && typeof neutralRaw === 'string' ? neutralRaw : undefined

  const theme: Theme = {}
  for (const [modeName, modeConfig] of Object.entries(modes)) {
    const resolved = resolveMode(modeName, modeConfig)
    for (const key of Object.keys(resolved.palettes)) {
      if (!baseInputs.has(key)) {
        throw new Error(
          `mode "${modeName}": palette override "${key}" is not a declared palette (have: ${[...baseInputs.keys()].join(', ')}).`,
        )
      }
    }
    const neutralSeed = resolved.palettes.neutral?.seed ?? neutralBase
    const ctx: ModeCtx = {
      name: modeName,
      isDark: resolved.isDark,
      steps,
      background: deriveBackground(neutralSeed, resolved.bgLightness),
      gamut: opts.targetGamut,
    }
    const scales: Record<string, ColorScale> = {}
    const on: Record<string, ColorScale> = {}
    const alpha: Record<string, ColorScale> = {}
    for (const [name, input] of baseInputs) {
      const paletteOpts = buildPaletteOpts(
        name,
        input,
        opts,
        resolved.palettes[name],
      )
      const out = produceValidated(algorithm, paletteOpts, ctx)
      scales[name] = out.scale
      on[name] = out.on
      // Alpha is a pure post-process of the solid ramp + the mode background, so it lives
      // here (not in producers) — opt-in, and absent from the output when off.
      if (opts.alpha)
        alpha[name] = computeAlphaColors(out.scale, ctx.background)
    }
    theme[modeName] = opts.alpha ? { scales, on, alpha } : { scales, on }
  }
  return theme
}
