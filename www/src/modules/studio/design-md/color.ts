/* Color: page, brand and button source, status seeds, the neutral's hue and
   tint, then every other token checked against the generated palette. */

import {
  createTheme,
  deltaEok,
  lstarOf,
  NEUTRAL_TINT_PEAK,
  NEUTRAL_TINT_SHAPE,
  STEPS,
  toOklch,
  WHISPER_LINE,
} from "@dotui/colors"
import type { Theme } from "@dotui/colors"

import { resolveColorConfig } from "@/registry/theme"

import { DEFAULT_STATE, DEFAULTS, validate } from "../axes"
import { buildColorConfig, SOLID_LEAVES, withSource } from "../axes/color"
import {
  add,
  buttonKey,
  chromatic,
  clamp,
  fmt,
  GRADIENT,
  hueGap,
  opaque,
  refToken,
  round,
  STATE_SUFFIX,
  statusOf,
} from "./context"
import type { ColorToken, Component, Ctx, Mode, State } from "./context"
import { color, kebab, median } from "./parse"

const PAGE = [
  "canvas",
  "canvas-light",
  "surface-canvas-light",
  "background",
  "bg",
  "page",
  "page-background",
  "base",
  "surface",
  "neutral",
]
const DARK_PAGE = [
  "canvas-dark",
  "canvas-night",
  "surface-canvas-dark",
  "background-dark",
  "bg-dark",
  "dark-canvas",
  "dark-background",
]
const STATUS = {
  success: ["success", "semantic-success", "positive", "status-success"],
  warning: ["warning", "semantic-warning", "caution", "status-warning"],
  danger: [
    "error",
    "danger",
    "destructive",
    "negative",
    "critical",
    "semantic-error",
    "semantic-danger",
    "status-error",
  ],
} as const
const STATUS_KEYS = {
  success: "successSeed",
  warning: "warningSeed",
  danger: "dangerSeed",
} as const
const INFO = ["info", "semantic-info", "status-info"]
const PAGE_NOTE = /\b(default )?page (background|body)\b/i

export interface ColorResult {
  mode: Mode
  pageL?: number
  brand?: string
}

function brandCandidates(tokens: ColorToken[]): ColorToken[] {
  const named = [
    "primary",
    "accent",
    "brand",
    "link",
    "link-blue",
    "tertiary",
    "secondary",
  ]
  const byName = (name: string) => tokens.find((t) => t.key === name)
  const prefixed = (prefix: string) =>
    tokens.filter((t) => t.key.startsWith(prefix) && !STATE_SUFFIX.test(t.key))
  return [
    ...named.map(byName),
    ...prefixed("accent-"),
    ...prefixed("brand-"),
    byName("info"),
  ].filter((t): t is ColorToken => !!t)
}

export function mapColor(
  ctx: Ctx,
  tokens: ColorToken[],
  components: Component[],
): ColorResult {
  const { state } = ctx
  const consumed = new Set<string>()
  const find = (names: readonly string[]) =>
    names
      .map((name) => tokens.find((t) => t.key === name && opaque(t.color)))
      .find((t) => !!t)

  // Page: the alias, unless the colors prose calls another token the page.
  let page = find(PAGE)
  if (!page?.note || !PAGE_NOTE.test(page.note)) {
    const noted = tokens.find(
      (t) => t.note && PAGE_NOTE.test(t.note) && opaque(t.color),
    )
    if (noted) page = noted
  }
  const pageL = page && lstarOf(page.color!.oklch!)
  const mode: Mode = pageL === undefined || pageL >= 50 ? "light" : "dark"
  const darkPage = mode === "light" ? find(DARK_PAGE) : undefined
  if (page) consumed.add(page.key)
  if (darkPage) consumed.add(darkPage.key)

  // Brand, and which source the buttons fill from.
  const btnKey = buttonKey(components)
  const btn = components.find((c) => c.key === btnKey)
  const btnColor = btn && color(btn.props.backgroundColor)
  let fill = opaque(btnColor) ? btnColor : undefined
  let fillToken = fill ? refToken(btn!.raw.backgroundColor) : undefined
  const guessed = !fill
  if (!fill) {
    // Prose-only files name roles in the bullet, not the token.
    const primary =
      tokens.find((t) => t.key === "primary" && opaque(t.color)) ??
      tokens.find(
        (t) =>
          t.note && /\b(primary|brand)\b/i.test(t.note) && chromatic(t.color),
      )
    fill = primary?.color as typeof fill
    fillToken = primary?.key
  }
  if (fillToken) consumed.add(fillToken)
  const fillSource = guessed
    ? `colors.${fillToken ?? "primary"}`
    : `components.${btnKey}.backgroundColor`

  let brand: string | undefined
  if (fill && chromatic(fill)) {
    brand = fill.hex
    add(ctx, "mapped", "color", {
      id: "brand",
      label: "Brand color from the primary button",
      source: fillSource,
      keys: ["brand", "preserveSeed"],
      value: fill.hex,
      result: brand,
    })
  } else {
    const alt = brandCandidates(tokens).find((t) => chromatic(t.color))
    if (alt) consumed.add(alt.key)
    if (fill) {
      brand = alt?.color!.hex ?? fill.hex
      Object.assign(state, withSource(SOLID_LEAVES, "neutral"))
      add(ctx, guessed ? "approximated" : "mapped", "color", {
        id: "button-source",
        label: guessed
          ? "Guessed: the file has no button component"
          : "Buttons and selected controls fill with the neutral ink",
        source: fillSource,
        keys: [...SOLID_LEAVES],
        value: fill.hex,
        result: "neutral",
      })
      add(ctx, "mapped", "color", {
        id: "brand",
        label: alt
          ? `Brand color from ${alt.name}; buttons stay ink`
          : "Brand kept achromatic: the file has no chromatic color",
        source: alt ? `colors.${alt.name}` : fillSource,
        keys: ["brand", "preserveSeed"],
        value: alt?.color!.hex ?? fill.hex,
        result: brand,
      })
    } else if (alt) {
      brand = alt.color!.hex
      add(ctx, "approximated", "color", {
        id: "brand",
        label: `No primary color; took ${alt.name}`,
        source: `colors.${alt.name}`,
        keys: ["brand", "preserveSeed"],
        value: brand,
        result: brand,
      })
    }
  }
  if (brand) {
    state.brand = brand
    state.preserveSeed = true
  } else
    add(ctx, "unmapped", "color", {
      id: "brand",
      label: "No brand color in the file",
    })

  // Status seeds; info has no studio key.
  const statusHexes: string[] = []
  for (const [name, names] of Object.entries(STATUS) as [
    keyof typeof STATUS,
    readonly string[],
  ][]) {
    const token = names
      .map((n) => tokens.find((t) => t.key === n))
      .find((t) => !!t)
    if (!token) continue
    consumed.add(token.key)
    if (chromatic(token.color)) {
      state[STATUS_KEYS[name]] = token.color!.hex
      statusHexes.push(token.color!.hex!)
      add(ctx, "mapped", "color", {
        id: `status:${name}`,
        label: `${name[0]!.toUpperCase()}${name.slice(1)} seed`,
        source: `colors.${token.name}`,
        keys: [STATUS_KEYS[name]],
        value: token.color!.hex,
        result: token.color!.hex,
      })
    } else
      unmappedRole(ctx, token, "not a usable seed (achromatic or translucent)")
  }
  for (const name of INFO) {
    const token = tokens.find((t) => t.key === name && !consumed.has(t.key))
    if (!token) continue
    consumed.add(token.key)
    unmappedRole(ctx, token, "the studio has no info seed")
  }

  // Page lightness per mode.
  if (page && pageL !== undefined) {
    const rounded = round(pageL, 0.5)
    const source = `colors.${page.name}`
    if (mode === "light") {
      const value = clamp(rounded, 90, 100)
      if (value !== DEFAULTS.lightBg) state.lightBg = value
      add(ctx, statusOf(value === rounded), "color", {
        id: "page:light",
        label: "Light page lightness",
        source,
        keys: ["lightBg"],
        value: page.color!.hex,
        result: `L* ${value}`,
        delta:
          value === rounded ? undefined : `L* ${pageL.toFixed(1)} → ${value}`,
      })
    } else {
      const value = clamp(rounded, 0, 20)
      if (value !== DEFAULTS.darkBg) state.darkBg = value
      add(ctx, statusOf(value === rounded), "color", {
        id: "page:dark",
        label: "Dark page lightness",
        source,
        keys: ["darkBg"],
        value: page.color!.hex,
        result: value === 0 ? "OLED black" : `L* ${value}`,
        delta:
          value === rounded ? undefined : `L* ${pageL.toFixed(1)} → ${value}`,
      })
      add(ctx, "approximated", "color", {
        id: "mode-derived:light",
        label:
          "Light mode is generated from the same seeds; the file documents dark only",
      })
    }
  }
  if (darkPage) {
    const darkL = lstarOf(darkPage.color!.oklch!)
    const value = clamp(round(darkL, 0.5), 0, 20)
    if (value !== DEFAULTS.darkBg) state.darkBg = value
    add(ctx, "approximated", "color", {
      id: "page:dark",
      label: `Dark page taken from ${darkPage.name} — may be a dark section, not a dark theme`,
      source: `colors.${darkPage.name}`,
      keys: ["darkBg"],
      value: darkPage.color!.hex,
      result: value === 0 ? "OLED black" : `L* ${value}`,
      delta: `L* ${darkL.toFixed(1)} → ${value}`,
    })
  } else if (page && mode === "light")
    add(ctx, "approximated", "color", {
      id: "mode-derived:dark",
      label:
        "Dark mode is generated from the same seeds; the file documents light only",
    })

  mapNeutral(ctx, tokens, mode, [brand, fill?.hex, ...statusHexes])
  checkFidelity(ctx, tokens, consumed, mode)
  return { mode, pageL, brand }
}

function unmappedRole(ctx: Ctx, token: ColorToken, reason: string) {
  add(ctx, "unmapped", "color", {
    id: `exact-role-color:${kebab(token.name)}`,
    label: `${token.name}: ${reason}`,
    source: `colors.${token.name}`,
    value: token.color?.hex ?? String(token.value),
  })
}

/** How much tint a sample implies at the neutral step nearest its L*. */
export function impliedTint(
  chroma: number,
  lightness: number,
  mode: Mode,
  stepLstars: readonly number[],
): number {
  let nearest = 0
  stepLstars.forEach((l, i) => {
    if (Math.abs(l - lightness) < Math.abs(stepLstars[nearest]! - lightness))
      nearest = i
  })
  return chroma / (NEUTRAL_TINT_PEAK * NEUTRAL_TINT_SHAPE[mode][nearest]!)
}

function engineBackground(state: State) {
  const dark = state.darkBg ?? DEFAULTS.darkBg
  return {
    light: state.lightBg ?? DEFAULTS.lightBg,
    dark: dark === 0 ? ("oled" as const) : dark,
  }
}

function mapNeutral(
  ctx: Ctx,
  tokens: ColorToken[],
  mode: Mode,
  excluded: (string | undefined)[],
) {
  const { state } = ctx
  const samples = tokens
    .map((t) => t.color)
    .filter(opaque)
    .filter((c) => c.oklch.c < 0.06 && !excluded.includes(c.hex))
    .map((c) => ({ oklch: c.oklch, l: lstarOf(c.oklch) }))
    .filter((s) => s.l > 1 && s.l < 99.5)
  if (samples.length === 0) return

  const brand = toOklch(state.brand ?? DEFAULTS.brand)
  const achromaticBrand = brand.c < WHISPER_LINE
  let x = 0
  let y = 0
  for (const { oklch } of samples) {
    if (oklch.c < 0.004) continue
    const rad = (oklch.h * Math.PI) / 180
    x += oklch.c * Math.cos(rad)
    y += oklch.c * Math.sin(rad)
  }
  const mean =
    x === 0 && y === 0
      ? undefined
      : Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360) % 360

  const theme = createTheme({
    seeds: { accent: state.brand ?? DEFAULTS.brand },
    neutralHue: mean,
    neutralTint: 1,
    background: engineBackground(state),
  })
  const stepLstars = STEPS.map((step) =>
    lstarOf(toOklch(theme[mode].scales.neutral![step])),
  )
  const implied = samples.map((s) =>
    impliedTint(s.oklch.c, s.l, mode, stepLstars),
  )
  const mid = median(implied)!
  const tint = clamp(round(mid, 0.05), 0, 2)
  const tintValue = Number(tint.toFixed(2))

  // A hue on pure grays (tint 0) would change nothing.
  const setHue =
    mean !== undefined &&
    tintValue > 0 &&
    (achromaticBrand || hueGap(mean, brand.h) > 20)
  if (setHue) {
    state.neutralHue = mean
    add(ctx, "mapped", "color", {
      id: "neutral-hue",
      label: "Neutral hue from the file's grays",
      keys: ["neutralHue"],
      result: `${mean}°`,
    })
  }

  if (achromaticBrand && mean === undefined && tintValue > 0) {
    add(ctx, "approximated", "color", {
      id: "neutral-tint",
      label: "Grays kept pure: no hue to tint them with",
      keys: ["neutralTint"],
      result: "0",
      delta: `implied ${fmt(mid)}`,
    })
    return
  }
  const exact =
    implied.every((v) => Math.abs(v - mid) <= 0.3) && round(mid, 0.05) <= 2
  if (tintValue !== DEFAULTS.neutralTint) state.neutralTint = tintValue
  add(ctx, statusOf(exact), "color", {
    id: "neutral-tint",
    label: "Neutral tint from the file's grays",
    keys: ["neutralTint"],
    result: String(tintValue),
    delta: exact
      ? undefined
      : `implied ${Math.min(...implied).toFixed(2)}–${Math.max(...implied).toFixed(2)}`,
  })
}

/** The final theme the state resolves to. */
function themeOf(state: State): Theme {
  const valid = validate(state)
  return resolveColorConfig(
    buildColorConfig(valid.ok ? valid.state : DEFAULT_STATE),
  )
}

function checkFidelity(
  ctx: Ctx,
  tokens: ColorToken[],
  consumed: Set<string>,
  mode: Mode,
) {
  const theme = themeOf(ctx.state)
  if (
    theme.report.warnings.some((w) =>
      w.startsWith("accent: seed lightness sits outside the solid job window"),
    )
  ) {
    const at = ctx.report.mapped.findIndex((item) => item.id === "brand")
    if (at !== -1) {
      const [item] = ctx.report.mapped.splice(at, 1)
      ctx.report.approximated.push({
        ...item!,
        delta: `ΔE ${theme.report.seedDelta.accent!.toFixed(3)}`,
      })
    }
  }

  const scales = theme[mode].scales
  const palettes = ["accent", "success", "warning", "danger"]
    .map((name) => ({ name, solid: toOklch(scales[name]!["700"]) }))
    .filter((p) => p.solid.c >= WHISPER_LINE)

  for (const token of tokens) {
    if (consumed.has(token.key)) continue
    if (
      GRADIENT.test(token.name) ||
      (typeof token.value === "string" && GRADIENT.test(token.value))
    ) {
      add(ctx, "unmapped", "color", {
        id: "gradient",
        label: "Gradients have no axis",
        source: `colors.${token.name}`,
      })
      continue
    }
    const c = token.color
    if (!c?.oklch) continue
    if (c.alpha < 1) {
      unmappedRole(ctx, token, "translucent colors have no token")
      continue
    }
    const palette =
      c.oklch.c < 0.06
        ? "neutral"
        : palettes
            .filter((p) => hueGap(p.solid.h, c.oklch!.h) <= 20)
            .sort(
              (a, b) =>
                hueGap(a.solid.h, c.oklch!.h) - hueGap(b.solid.h, c.oklch!.h),
            )[0]?.name
    if (!palette) {
      unmappedRole(ctx, token, "an extra hue the palette doesn't generate")
      continue
    }
    let best = { step: "", delta: Infinity }
    for (const step of STEPS) {
      const delta = deltaEok(c.oklch, toOklch(scales[palette]![step]))
      if (delta < best.delta) best = { step, delta }
    }
    if (best.delta > 0.1) {
      unmappedRole(ctx, token, `no ${palette} step comes close`)
      continue
    }
    add(ctx, statusOf(best.delta <= 0.02), "color", {
      id: `color-role:${kebab(token.name)}`,
      label: `${token.name} on a generated step`,
      source: `colors.${token.name}`,
      value: c.hex,
      result: `${palette} ${best.step}`,
      delta: best.delta <= 0.02 ? undefined : `ΔE ${best.delta.toFixed(3)}`,
    })
  }
}
