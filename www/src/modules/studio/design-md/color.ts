import {
  createTheme,
  deltaEok,
  lstarOf,
  NEUTRAL_TINT_PEAK,
  NEUTRAL_TINT_SHAPE,
  SEED_SNAP_BOUND,
  STEPS,
  toHex,
  toOklch,
  WHISPER_LINE,
} from "@dotui/colors"
import type { Oklch, Theme } from "@dotui/colors"

import { resolveColorConfig } from "@/registry/theme"

import { DEFAULT_STATE, DEFAULTS, validate } from "../axes"
import { buildColorConfig, SOLID_LEAVES, withSource } from "../axes/color"
import {
  add,
  buttonKey,
  capitalize,
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
import type { ParsedColor } from "./parse"

type Solid = ParsedColor & { oklch: Oklch; hex: string }

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
// Prose-only files name the page loosely: "Deepest background surface".
const LOOSE_PAGE_NOTE =
  /\b(default|main|dominant|deepest) (?:(?!(cards?|buttons?|inputs?|fields?)\b)[\w-]+ ){0,2}(background|canvas|surface)\b/i
// A dark page token that the file calls its default canvas wins.
const DARK_DEFAULT_NOTE =
  /\b(default|primary|main|dominant) (?:[\w-]+ ){0,2}(canvas|background|page floor)\b/i
// "Main canvas in dark mode" only says which mode the token belongs to.
const MODE_QUALIFIED = /\bdark (mode|theme|sections?)\b/i
const BRAND_NOTES = [
  /primary (buttons?|actions?|ctas?)\b|button fill|filled[- ]cta|primary filled/i,
  /\b(primary|brand)\b/i,
  /\bCTAs?\b|call[- ]to[- ]action/i,
]
const BRAND_NAMES = [
  "primary",
  "accent",
  "brand",
  "link",
  "link-blue",
  "text-link",
  "link-primary",
  "link-default",
  "action",
  "tertiary",
  "secondary",
]
const BRAND_PREFIXES = [
  "accent-",
  "brand-",
  "primary-",
  "link-",
  "text-link-",
  "action-",
]
const NOT_BRAND_WORD =
  /\b(success|warning|error|danger|info|caution|critical|positive|negative|destructive|sale|fallback)\b/
// Reds read as danger, so a guess never lands on one.
const NOT_BRAND_ANY =
  /^(surface|hairline|border|on|canvas|bg|background|ink|text|body|muted?|shadow|overlay|red|rose|crimson)(-|$)|ring|focus|terminal|mockup|syntax|code|chart/
// Below this L* a chromatic button reads as ink, not a brand hue.
const INK_LSTAR = 15
// A guessed brand must clear the neutral line the fidelity check uses.
const NEUTRAL_C = 0.06

export interface ColorResult {
  mode: Mode
  pageL?: number
  brand?: string
}

const usable = (t: ColorToken) =>
  opaque(t.color) &&
  t.color.oklch.c >= NEUTRAL_C &&
  lstarOf(t.color.oklch) >= INK_LSTAR &&
  !NOT_BRAND_WORD.test(t.key) &&
  !STATE_SUFFIX.test(t.key) &&
  !GRADIENT.test(t.key)

// A numbered palette's mid step stands for the hue.
const stepGap = (key: string) => {
  const step = /-(\d{2,3})$/.exec(key)?.[1]
  return step ? Math.abs(Number(step) - 500) : 0
}

// A brand-named token first; else, when allowed, any other chromatic token.
function brandCandidate(
  tokens: ColorToken[],
  anyName: boolean,
): { token: ColorToken; named: boolean } | undefined {
  const named = [
    ...BRAND_NAMES.map((name) => tokens.find((t) => t.key === name)),
    ...BRAND_PREFIXES.flatMap((prefix) =>
      tokens
        .filter((t) => t.key.startsWith(prefix))
        .sort((a, b) => stepGap(a.key) - stepGap(b.key)),
    ),
  ].find((t): t is ColorToken => !!t && usable(t))
  if (named) return { token: named, named: true }
  const other = anyName
    ? tokens.find(
        (t) =>
          usable(t) &&
          !NOT_BRAND_ANY.test(t.key) &&
          opaque(t.color) &&
          lstarOf(t.color.oklch) <= 90,
      )
    : undefined
  return other && { token: other, named: false }
}

export function mapColor(
  ctx: Ctx,
  tokens: ColorToken[],
  components: Component[],
  proseOnly: boolean,
): ColorResult {
  const { state } = ctx
  const consumed = new Set<string>()
  const solid = (t?: ColorToken): Solid | undefined =>
    t && opaque(t.color) ? t.color : undefined
  const find = (names: readonly string[]) =>
    names
      .map((name) => tokens.find((t) => t.key === name && solid(t)))
      .find((t) => !!t)
  const noted = (re: RegExp, test: (t: ColorToken) => unknown = solid) =>
    tokens.find((t) => t.note && re.test(t.note) && test(t))

  // Page: the alias, unless the colors prose calls another token the page.
  let page = find(PAGE)
  // The light page, kept for lightBg when a dark canvas is the default.
  let lightPage: ColorToken | undefined
  if (!page?.note || !PAGE_NOTE.test(page.note)) {
    const named =
      noted(PAGE_NOTE) ?? (proseOnly ? noted(LOOSE_PAGE_NOTE) : undefined)
    if (named) page = named
    else if (!page?.note || !DARK_DEFAULT_NOTE.test(page.note)) {
      const dark = DARK_PAGE.map((name) =>
        tokens.find((t) => t.key === name),
      ).find((t) => {
        const c = solid(t)
        return (
          !!c &&
          !!t?.note &&
          DARK_DEFAULT_NOTE.test(t.note) &&
          !MODE_QUALIFIED.test(t.note) &&
          lstarOf(c.oklch) < 50
        )
      })
      if (dark) {
        lightPage = page
        page = dark
      }
    }
  }
  const pageColor = solid(page)
  const pageL = pageColor && lstarOf(pageColor.oklch)
  const mode: Mode = pageL === undefined || pageL >= 50 ? "light" : "dark"
  const darkPage = mode === "light" ? find(DARK_PAGE) : undefined
  const darkColor = solid(darkPage)
  const lightColor = mode === "light" ? pageColor : solid(lightPage)
  const lightL = lightColor && lstarOf(lightColor.oklch)
  const lightToken = mode === "light" ? page : lightPage
  for (const t of [page, darkPage, lightPage]) if (t) consumed.add(t.key)

  // Brand, and which source the buttons fill from.
  const btnKey = buttonKey(components)
  const btn = components.find((c) => c.key === btnKey)
  const btnColor = btn && color(btn.props.backgroundColor)
  let fill: Solid | undefined = opaque(btnColor) ? btnColor : undefined
  let fillToken = fill ? refToken(btn?.raw.backgroundColor) : undefined
  const guessed = !fill
  if (!fill) {
    // Prose-only files name roles in the bullet, not the token.
    const primary =
      tokens.find((t) => t.key === "primary" && solid(t)) ??
      BRAND_NOTES.map((re) => noted(re, usable)).find((t) => !!t)
    fill = solid(primary)
    fillToken = primary?.key
  }
  if (fillToken) consumed.add(fillToken)
  const fillSource = guessed
    ? `colors.${fillToken ?? "primary"}`
    : `components.${btnKey}.backgroundColor`

  const inky = !!fill && chromatic(fill) && lstarOf(fill.oklch) < INK_LSTAR
  const alt =
    fill && chromatic(fill) && !inky ? undefined : brandCandidate(tokens, !inky)
  if (alt) consumed.add(alt.token.key)
  const altColor = solid(alt?.token)
  const altSource = alt && `colors.${alt.token.name}`

  let brand: string | undefined
  if (fill && !alt && chromatic(fill)) {
    brand = fill.hex
    add(ctx, statusOf(!inky), "color", {
      id: "brand",
      label: inky
        ? "Near-black button taken as the brand: no other brand color"
        : guessed
          ? `Brand color from ${fillToken ?? "the primary color"}`
          : "Brand color from the primary button",
      source: fillSource,
      keys: ["brand", "preserveSeed"],
      value: fill.hex,
      result: brand,
    })
  } else if (fill) {
    brand = altColor?.hex ?? fill.hex
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
    const ink = inky ? "Near-black buttons stay ink" : "Buttons stay ink"
    add(ctx, statusOf(!alt), "color", {
      id: "brand",
      label: !alt
        ? "Brand kept achromatic: the file has no usable chromatic color"
        : alt.named
          ? `${ink}; brand color from ${alt.token.name}`
          : `${ink}; brand guessed from ${alt.token.name}, no brand-named color`,
      source: altSource ?? fillSource,
      keys: ["brand", "preserveSeed"],
      value: brand,
      result: brand,
    })
  } else if (alt && altColor) {
    brand = altColor.hex
    add(ctx, "approximated", "color", {
      id: "brand",
      label: `No primary color; took ${alt.token.name}`,
      source: altSource,
      keys: ["brand", "preserveSeed"],
      value: brand,
      result: brand,
    })
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
    const seed = solid(token)
    if (seed && chromatic(seed)) {
      state[STATUS_KEYS[name]] = seed.hex
      statusHexes.push(seed.hex)
      add(ctx, "mapped", "color", {
        id: `status:${name}`,
        label: `${capitalize(name)} seed`,
        source: `colors.${token.name}`,
        keys: [STATUS_KEYS[name]],
        value: seed.hex,
        result: seed.hex,
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

  const hasLight =
    !!lightToken && !!lightColor && lightL !== undefined && lightL >= 50
  if (hasLight) {
    const rounded = round(lightL, 0.5)
    const value = clamp(rounded, 90, 100)
    if (value !== DEFAULTS.lightBg) state.lightBg = value
    add(ctx, statusOf(value === rounded), "color", {
      id: "page:light",
      label: "Light page lightness",
      source: `colors.${lightToken.name}`,
      keys: ["lightBg"],
      value: lightColor.hex,
      result: `L* ${value}`,
      delta:
        value === rounded ? undefined : `L* ${lightL.toFixed(1)} → ${value}`,
    })
  }
  if (page && pageColor && pageL !== undefined && mode === "dark") {
    const rounded = round(pageL, 0.5)
    const value = clamp(rounded, 0, 20)
    if (value !== DEFAULTS.darkBg) state.darkBg = value
    add(ctx, statusOf(value === rounded), "color", {
      id: "page:dark",
      label: "Dark page lightness",
      source: `colors.${page.name}`,
      keys: ["darkBg"],
      value: pageColor.hex,
      result: value === 0 ? "OLED black" : `L* ${value}`,
      delta:
        value === rounded ? undefined : `L* ${pageL.toFixed(1)} → ${value}`,
    })
    if (!hasLight)
      add(ctx, "approximated", "color", {
        id: "mode-derived:light",
        label:
          "Light mode is generated from the same seeds; the file documents dark only",
      })
  }
  if (darkPage && darkColor) {
    const darkL = lstarOf(darkColor.oklch)
    const value = clamp(round(darkL, 0.5), 0, 20)
    if (value !== DEFAULTS.darkBg) state.darkBg = value
    add(ctx, "approximated", "color", {
      id: "page:dark",
      label: `Dark page taken from ${darkPage.name} — may be a dark section, not a dark theme`,
      source: `colors.${darkPage.name}`,
      keys: ["darkBg"],
      value: darkColor.hex,
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

// How much tint a sample implies at the neutral step nearest its L*.
export function impliedTint(
  chroma: number,
  lightness: number,
  mode: Mode,
  stepLstars: readonly number[],
): number {
  let nearest = 0
  stepLstars.forEach((l, i) => {
    const best = stepLstars[nearest] ?? l
    if (Math.abs(l - lightness) < Math.abs(best - lightness)) nearest = i
  })
  return chroma / (NEUTRAL_TINT_PEAK * (NEUTRAL_TINT_SHAPE[mode][nearest] ?? 1))
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

  const neutral = createTheme({
    seeds: { accent: state.brand ?? DEFAULTS.brand },
    neutralHue: mean,
    neutralTint: 1,
    background: engineBackground(state),
  })[mode].scales.neutral
  if (!neutral) return
  const stepLstars = STEPS.map((step) => lstarOf(toOklch(neutral[step])))
  const implied = samples.map((s) =>
    impliedTint(s.oklch.c, s.l, mode, stepLstars),
  )
  const mid = median(implied) ?? 0
  const tint = Number(clamp(round(mid, 0.05), 0, 2).toFixed(2))

  // A hue on pure grays (tint 0) would change nothing.
  const setHue =
    mean !== undefined &&
    tint > 0 &&
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

  if (achromaticBrand && mean === undefined && tint > 0) {
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
  if (tint !== DEFAULTS.neutralTint) state.neutralTint = tint
  add(ctx, statusOf(exact), "color", {
    id: "neutral-tint",
    label: "Neutral tint from the file's grays",
    keys: ["neutralTint"],
    result: String(tint),
    delta: exact
      ? undefined
      : `implied ${Math.min(...implied).toFixed(2)}–${Math.max(...implied).toFixed(2)}`,
  })
}

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
  // Only the accent is pinned: the engine re-solves status seeds.
  for (const name of Object.keys(STATUS_KEYS)) {
    const delta = theme.report.seedDelta[name] ?? 0
    const clamped = theme.report.warnings.some((w) =>
      w.startsWith(`${name}: seed lightness sits outside the solid job window`),
    )
    if (delta <= SEED_SNAP_BOUND && !clamped) continue
    const at = ctx.report.mapped.findIndex((i) => i.id === `status:${name}`)
    const [item] = at === -1 ? [] : ctx.report.mapped.splice(at, 1)
    const solid = theme.light.scales[name]?.["700"]
    if (item)
      ctx.report.approximated.push({
        ...item,
        result: solid ? toHex(toOklch(solid)) : item.result,
        delta: `ΔE ${delta.toFixed(3)}`,
      })
  }

  const scales = theme[mode].scales
  const palettes = ["accent", "success", "warning", "danger"]
    .flatMap((name) => {
      const scale = scales[name]
      return scale ? [{ name, scale, solid: toOklch(scale["700"]) }] : []
    })
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
    if (!c?.oklch || !c.hex) continue
    if (c.alpha < 1) {
      unmappedRole(ctx, token, "translucent colors have no token")
      continue
    }
    const { h } = c.oklch
    const palette =
      c.oklch.c < 0.06
        ? { name: "neutral", scale: scales.neutral }
        : palettes
            .filter((p) => hueGap(p.solid.h, h) <= 20)
            .sort((a, b) => hueGap(a.solid.h, h) - hueGap(b.solid.h, h))[0]
    if (!palette?.scale) {
      unmappedRole(ctx, token, "an extra hue the palette doesn't generate")
      continue
    }
    let best = { step: "", delta: Infinity }
    for (const step of STEPS) {
      const delta = deltaEok(c.oklch, toOklch(palette.scale[step]))
      if (delta < best.delta) best = { step, delta }
    }
    if (best.delta > 0.1) {
      unmappedRole(ctx, token, `no ${palette.name} step comes close`)
      continue
    }
    add(ctx, statusOf(best.delta <= 0.02), "color", {
      id: `color-role:${kebab(token.name)}`,
      label: `${token.name} on a generated step`,
      source: `colors.${token.name}`,
      value: c.hex,
      result: `${palette.name} ${best.step}`,
      delta: best.delta <= 0.02 ? undefined : `ΔE ${best.delta.toFixed(3)}`,
    })
  }
}
