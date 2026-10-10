/* A parsed DESIGN.md mapped onto the studio's existing axes, chapter by
   chapter, with a report of what mapped, what was approximated and what has
   no axis yet. Never adds an axis: what doesn't fit is reported. */

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
import type { Oklch, Theme } from "@dotui/colors"

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  FONT_CATALOG,
} from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cleanName } from "@/lib/snapshots/snapshot"
import { resolveColorConfig } from "@/registry/theme"

import { DEFAULT_STATE, DEFAULTS, validate } from "../axes"
import type { StudioStateInput } from "../axes"
import { buildColorConfig, SOLID_LEAVES, withSource } from "../axes/color"
import { LIBRARY_OPTIONS } from "../axes/icons"
import { rungIndex, SHAPE_CHARACTERS, SHAPE_RUNGS } from "../axes/shape"
import { DENSITY_TIERS } from "../axes/space"
import { flatAllowed } from "../axes/surfaces"
import type {
  DesignMdImport,
  ImportCategory,
  ImportItem,
  ImportStatus,
} from "./index"
import {
  box,
  codeOrText,
  color,
  colorNotes,
  dim,
  isRecord,
  kebab,
  median,
  proseColors,
  proseFonts,
  sentences,
  shadows,
  shadowStrength,
} from "./parse"
import type {
  FontRole,
  ParsedColor,
  ParsedDesignMd,
  ShadowLayer,
} from "./parse"

type Mode = "light" | "dark"
type State = Partial<StudioStateInput>

/* --------------------------------- context -------------------------------- */

interface Ctx {
  doc: ParsedDesignMd
  state: State
  report: DesignMdImport["report"]
  warnings: string[]
  seen: Set<string>
}

function add(
  ctx: Ctx,
  status: ImportStatus,
  category: ImportCategory,
  item: Omit<ImportItem, "category">,
) {
  if (ctx.seen.has(item.id)) return
  ctx.seen.add(item.id)
  ctx.report[status].push({ category, ...item })
}

const statusOf = (exact: boolean): ImportStatus =>
  exact ? "mapped" : "approximated"

const round = (value: number, step: number) => Math.round(value / step) * step
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
const fmt = (value: number) => String(Number(value.toFixed(2)))
const px = (value: number) => `${fmt(value)}px`

const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

const lstar = (oklch: Oklch) => lstarOf(oklch)

/* ------------------------------ the file's data --------------------------- */

interface ColorToken {
  name: string
  key: string
  value: unknown
  color?: ParsedColor
  note?: string
}

interface Component {
  key: string
  props: Record<string, unknown>
  raw: Record<string, unknown>
}

const STATE_SUFFIX =
  /-(hover|hovered|pressed|press|active|focus|focused|disabled|selected|visited|open|checked)$/
const GRADIENT = /gradient/i

const INPUT_KEY = [
  /^(text-)?input$/,
  /^form-input/,
  /text-field/,
  /search-(input|field)/,
  /^select$/,
]
const CARD_KEY = /card|tile/
const NOT_CARD =
  /mockup|screenshot|illustration|hero|logo|image|avatar|badge|banner|band/
const SURFACE_KEY =
  /^(popover|menu|dropdown|tooltip|command|combobox-(list|popover)|select-(menu|content|popover))/
const PANEL_KEY = /modal|dialog|sheet|drawer/
const SIZE_SUFFIX = /-(xs|sm|small|lg|large|xl)$/

const isInput = (key: string) => INPUT_KEY.some((re) => re.test(key))
const isCard = (key: string) => CARD_KEY.test(key) && !NOT_CARD.test(key)

function flatten(
  record: Record<string, unknown>,
  prefix = "",
): [string, unknown][] {
  return Object.entries(record).flatMap(([key, value]) =>
    isRecord(value)
      ? flatten(value, `${prefix}${key}-`)
      : [[`${prefix}${key}`, value] as [string, unknown]],
  )
}

function readColors(ctx: Ctx): {
  tokens: ColorToken[]
  source: DesignMdImport["source"]
} {
  const { doc } = ctx
  const colors = doc.tokens?.colors
  if (isRecord(colors) && Object.keys(colors).length > 0) {
    const notes = colorNotes(doc.sections.colors ?? "")
    const tokens = flatten(colors).map(([name, value]) => {
      const parsed = color(value)
      const looksGradient =
        GRADIENT.test(name) ||
        (typeof value === "string" && GRADIENT.test(value))
      if (!parsed && !looksGradient) ctx.warnings.push(`invalid color ${name}`)
      return {
        name,
        key: name.toLowerCase(),
        value,
        color: parsed,
        note: notes.get(name.toLowerCase()),
      }
    })
    return { tokens, source: "frontmatter" }
  }
  const prose = proseColors(doc.sections.colors ?? doc.prose)
  if (prose.length === 0) return { tokens: [], source: "none" }
  ctx.warnings.push(
    "No frontmatter — read colors, fonts and elevation from prose only.",
  )
  return {
    tokens: prose.map(({ name, value, note }) => ({
      name,
      key: name,
      value,
      color: color(value),
      note,
    })),
    source: "prose",
  }
}

function readComponents(doc: ParsedDesignMd): Component[] {
  const resolved = doc.tokens?.components
  const raw = doc.raw?.components
  if (!isRecord(resolved)) return []
  return Object.entries(resolved)
    .filter((entry): entry is [string, Record<string, unknown>] =>
      isRecord(entry[1]),
    )
    .map(([key, props]) => ({
      key: key.toLowerCase(),
      props,
      raw: isRecord(raw) && isRecord(raw[key]) ? raw[key] : {},
    }))
}

const opaque = (
  c?: ParsedColor,
): c is ParsedColor & { oklch: Oklch; hex: string } =>
  !!c?.oklch && c.alpha >= 1
const chromatic = (c?: ParsedColor) => opaque(c) && c.oklch.c >= WHISPER_LINE

/** The primary button's key, by the naming the corpus uses. */
function buttonKey(components: Component[]): string | undefined {
  const keys = components.map((c) => c.key).filter((k) => !STATE_SUFFIX.test(k))
  return (
    keys.find((k) =>
      /^(button|btn)(-primary)?(-(pill|md|default|base))?$/.test(k),
    ) ??
    keys.find((k) => /^button-primary/.test(k)) ??
    keys.find((k) => k === "primary-button") ??
    keys.find((k) => k === "cta-primary")
  )
}

const refToken = (value: unknown) =>
  typeof value === "string"
    ? /^\{colors\.([\w-]+)\}$/.exec(value.trim())?.[1]?.toLowerCase()
    : undefined

const hasBorder = (props: Record<string, unknown>) =>
  ["border", "borderColor"].some(
    (key) =>
      key in props && !/^(none|0|0px)$/i.test(String(props[key] ?? "").trim()),
  )

/* ---------------------------------- color --------------------------------- */

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

interface ColorResult {
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

function mapColor(
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

  // Page: the alias, unless the colors prose names another the page.
  let page = find(PAGE)
  if (!page?.note || !PAGE_NOTE.test(page.note)) {
    const noted = tokens.find(
      (t) => t.note && PAGE_NOTE.test(t.note) && opaque(t.color),
    )
    if (noted) page = noted
  }
  const pageL = page && lstar(page.color!.oklch!)
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
    const darkL = lstar(darkPage.color!.oklch!)
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
    .map((c) => ({ oklch: c.oklch, l: lstar(c.oklch) }))
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
    lstar(toOklch(theme[mode].scales.neutral![step])),
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

/* -------------------------------- typography ------------------------------ */

type Category = "sans" | "serif" | "mono"

const CATALOG = new Map(
  FONT_CATALOG.map((font) => [normalizeFamily(font.family), font]),
)
const SUBSTITUTE =
  /substitut|fallback|alternative|closest|approximat|similar|in place of/i
const CATEGORY: Partial<Record<FontCategory, Category>> = {
  "sans-serif": "sans",
  serif: "serif",
  mono: "mono",
}
const FAMILY_MATCHER = new RegExp(
  `(?<![A-Za-z0-9])(${FONT_CATALOG.filter((font) => CATEGORY[font.category])
    .map((font) => font.family)
    .sort((a, b) => b.length - a.length)
    .map((family) => family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})(?![A-Za-z0-9])`,
  "g",
)
const GENERIC: Record<string, Category> = {
  "system-ui": "sans",
  "-apple-system": "sans",
  blinkmacsystemfont: "sans",
  "ui-sans-serif": "sans",
  "sans-serif": "sans",
  "segoe ui": "sans",
  "ui-serif": "serif",
  serif: "serif",
  monospace: "mono",
  "ui-monospace": "mono",
}
const ALIASES: [RegExp, string][] = [
  [
    /^(sf pro|helvetica|arial$|neue haas|haas|söhne|sohne|system-ui$)/i,
    "Inter",
  ],
  [/^(georgia$|times|tiempos|copernicus$)/i, "Source Serif 4"],
]

function normalizeFamily(name: string) {
  return name.toLowerCase().replace(/[\s_'"-]+/g, "")
}

function catalogFamily(name: string): string | undefined {
  const tries = [name, name.replace(/[\s-]*(variable|vf|var)$/i, "")]
  tries.push(tries[1]!.replace(/[\s-]+(display|text|sans)$/i, ""))
  for (const candidate of tries) {
    const hit = CATALOG.get(normalizeFamily(candidate))
    if (hit) return hit.family
  }
}

interface Resolution {
  family: string
  exact: boolean
  label: string
}

export function resolveFamily(
  stack: string,
  role: FontRole,
  typographyProse: string,
): Resolution {
  const entries = stack
    .split(",")
    .map((entry) =>
      entry
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .trim(),
    )
    .filter(Boolean)
  let hint: Category | undefined
  for (const [i, entry] of entries.entries()) {
    const generic = GENERIC[entry.toLowerCase()]
    if (generic || entry.toLowerCase().startsWith("ui-")) {
      hint ??= generic
      continue
    }
    const family = catalogFamily(entry)
    if (family)
      return i === 0
        ? { family, exact: true, label: "Font from the file" }
        : { family, exact: false, label: "Used the file's listed fallback" }
  }
  const want: Category =
    role === "mono" || hint === "mono"
      ? "mono"
      : role === "heading" && hint === "serif"
        ? "serif"
        : "sans"
  // Code spans are CSS stacks, not named substitutes.
  for (const sentence of sentences(typographyProse.replace(/`[^`]*`/g, ""))) {
    if (!SUBSTITUTE.test(sentence)) continue
    for (const match of sentence.matchAll(FAMILY_MATCHER)) {
      const font = CATALOG.get(normalizeFamily(match[1]!))
      if (font && CATEGORY[font.category] === want)
        return {
          family: font.family,
          exact: false,
          label: "Substitute named in the file",
        }
    }
  }
  for (const entry of entries)
    for (const [pattern, family] of ALIASES)
      if (pattern.test(entry))
        return { family, exact: false, label: "Closest open alternative" }
  const fallback =
    hint === "mono" || role === "mono"
      ? DEFAULT_MONO_FAMILY
      : hint === "serif"
        ? "Source Serif 4"
        : DEFAULT_BODY_FAMILY
  return {
    family: fallback,
    exact: false,
    label: "No open match; used the default",
  }
}

const familyOf = (entry: Record<string, unknown>) => {
  const value = entry.fontFamily
  return Array.isArray(value)
    ? value.join(", ")
    : typeof value === "string"
      ? value
      : undefined
}

function mostFrequent(values: (string | undefined)[]): string | undefined {
  const counts = new Map<string, number>()
  for (const value of values)
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  let best: string | undefined
  for (const [value, count] of counts)
    if (best === undefined || count > counts.get(best)!) best = value
  return best
}

function mapTypography(ctx: Ctx, proseOnly: boolean) {
  const { doc, state } = ctx
  const typography = doc.tokens?.typography
  const entries = isRecord(typography)
    ? Object.entries(typography).filter(
        (e): e is [string, Record<string, unknown>] => isRecord(e[1]),
      )
    : []
  const prose = doc.sections.typography ?? doc.prose

  const stacks: Partial<Record<FontRole, { stack: string; source: string }>> =
    {}
  if (entries.length > 0) {
    const named = (re: RegExp) =>
      entries.filter(([name]) => re.test(name.toLowerCase()))
    const body = named(/^body/)
    let bodyEntry = body.sort(
      (a, b) =>
        Math.abs((dim(a[1].fontSize) ?? Infinity) - 16) -
        Math.abs((dim(b[1].fontSize) ?? Infinity) - 16),
    )[0]
    bodyEntry ??= named(/^(text|paragraph|copy)/)[0]
    const bodyStack = bodyEntry
      ? familyOf(bodyEntry[1])
      : mostFrequent(entries.map(([, e]) => familyOf(e)))
    if (bodyStack)
      stacks.body = {
        stack: bodyStack,
        source: bodyEntry ? `typography.${bodyEntry[0]}` : "typography",
      }
    const heading = mostFrequent(
      named(/^(display|headline|heading|h[1-3]|title|hero)/).map(([, e]) =>
        familyOf(e),
      ),
    )
    if (heading) stacks.heading = { stack: heading, source: "typography" }
    const mono = mostFrequent(
      entries
        .filter(
          ([name, e]) =>
            /mono|code/.test(name.toLowerCase()) ||
            /monospace|mono/i.test(familyOf(e) ?? ""),
        )
        .map(([, e]) => familyOf(e)),
    )
    if (mono) stacks.mono = { stack: mono, source: "typography" }
  } else {
    for (const [role, stack] of Object.entries(proseFonts(prose)))
      stacks[role as FontRole] = { stack, source: "prose: Typography" }
  }

  const resolved: Partial<Record<FontRole, Resolution>> = {}
  for (const role of ["body", "heading", "mono"] as const) {
    const entry = stacks[role]
    if (!entry) continue
    const resolution = resolveFamily(entry.stack, role, prose)
    resolved[role] = resolution
    const prosey = proseOnly || entry.source.startsWith("prose")
    const key =
      role === "body"
        ? "bodyFont"
        : role === "mono"
          ? "monoFont"
          : "headingFont"
    let result = resolution.family
    if (role === "body" && resolution.family !== DEFAULT_BODY_FAMILY)
      state.bodyFont = resolution.family
    if (role === "mono" && resolution.family !== DEFAULT_MONO_FAMILY)
      state.monoFont = resolution.family
    if (role === "heading") {
      const same =
        resolution.family === (resolved.body?.family ?? DEFAULT_BODY_FAMILY)
      state.headingFont = same ? "" : resolution.family
      if (same) result = `${resolution.family} (same as body)`
    }
    add(ctx, statusOf(resolution.exact && !prosey), "typography", {
      id: `font:${role}`,
      label: resolution.label,
      source: entry.source,
      keys: [key],
      value: entry.stack,
      result,
    })
  }

  const all = entries.map(([, e]) => e)
  const some = (test: (e: Record<string, unknown>) => boolean) => all.some(test)
  if (some((e) => e.fontSize !== undefined || e.lineHeight !== undefined))
    add(ctx, "unmapped", "typography", {
      id: "type-scale",
      label: "Type scale: sizes and line heights have no axis",
    })
  if (some((e) => e.fontWeight !== undefined))
    add(ctx, "unmapped", "typography", {
      id: "type-weights",
      label: "Font weights have no axis",
    })
  if (
    some((e) => {
      const value = e.letterSpacing
      if (value === undefined || value === null) return false
      const n = dim(value)
      return n === undefined
        ? !/^(normal|0\w*)$/i.test(String(value).trim())
        : n !== 0
    })
  )
    add(ctx, "unmapped", "typography", {
      id: "type-tracking",
      label: "Letter spacing has no axis",
    })
  if (
    some((e) => Object.keys(e).some((k) => /^font(Feature|Variation)/.test(k)))
  )
    add(ctx, "unmapped", "typography", {
      id: "font-features",
      label: "Font features and variations have no axis",
    })
}

/* ---------------------------------- shape --------------------------------- */

export interface RadiusTargets {
  control?: number
  card?: number
  surface?: number
  panel?: number
}

type ShapeRole = keyof RadiusTargets

const ROLE_DEFAULT: Record<ShapeRole, string> = {
  control: "md",
  card: "lg",
  surface: "lg",
  panel: "xl",
}
const FIT_RUNGS = SHAPE_RUNGS.filter((rung) => Number.isFinite(rung.ratio))
const ratioOf = (id: string) => SHAPE_RUNGS[rungIndex(id)]!.ratio
const rungAt = (index: number) =>
  SHAPE_RUNGS[clamp(index, 0, SHAPE_RUNGS.length - 1)]!.id
const rungBelow = (id: string) => rungAt(rungIndex(id) - 1)
const rungAbove = (id: string) => rungAt(rungIndex(id) + 1)

/** The base and a rung per role that best fit the targets (finite px). */
export function fitRadius(targets: RadiusTargets): {
  radius: number
  rungs: Partial<Record<ShapeRole, string>>
} {
  const roles = (Object.keys(targets) as ShapeRole[]).filter(
    (role) => targets[role] !== undefined,
  )
  let best = {
    cost: Infinity,
    radius: 10,
    rungs: {} as Partial<Record<ShapeRole, string>>,
  }
  for (let k = 4; k <= 40; k++) {
    const radius = k / 2
    const rungs: Partial<Record<ShapeRole, string>> = {}
    let cost = 0.01 * Math.abs(radius - 10)
    for (const role of roles) {
      const target = targets[role]!
      let pick = { id: "", cost: Infinity }
      for (const rung of FIT_RUNGS) {
        const c =
          Math.abs(radius * rung.ratio - target) +
          (rung.id === ROLE_DEFAULT[role] ? 0 : 0.25)
        if (c < pick.cost) pick = { id: rung.id, cost: c }
      }
      rungs[role] = pick.id
      cost += pick.cost
    }
    if (cost < best.cost - 1e-9) best = { cost, radius, rungs }
  }
  return { radius: best.radius, rungs: best.rungs }
}

const PILL = Infinity

function radiusOf(component: Component): number | undefined {
  const r = dim(component.props.rounded)
  if (r === undefined) return
  const height = dim(component.props.height)
  return r >= 999 || (height !== undefined && r >= height / 2) ? PILL : r
}

interface Families {
  button: Component[]
  input: Component[]
  card: Component[]
  surface: Component[]
  panel: Component[]
}

function families(components: Component[]): Families {
  const nonState = components.filter((c) => !STATE_SUFFIX.test(c.key))
  const btn = buttonKey(components)
  const sized = btn
    ? new RegExp(
        `^${btn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(xs|sm|small|md|lg|large|xl|pill|default|base)$`,
      )
    : undefined
  return {
    button: nonState.filter((c) => c.key === btn || sized?.test(c.key)),
    input: nonState.filter((c) => isInput(c.key)),
    card: nonState.filter((c) => isCard(c.key)),
    surface: nonState.filter((c) => SURFACE_KEY.test(c.key)),
    panel: nonState.filter((c) => PANEL_KEY.test(c.key)),
  }
}

const medianRadius = (list: Component[]) =>
  median(list.map(radiusOf).filter((r): r is number => r !== undefined))

function mapShape(ctx: Ctx, components: Component[], fam: Families) {
  const { doc, state } = ctx
  const rounded = isRecord(doc.tokens?.rounded) ? doc.tokens.rounded : undefined
  const fromScale = components.length === 0
  const targets: RadiusTargets = {}
  let buttonTarget: number | undefined
  if (fromScale) {
    if (!rounded) return
    const control = dim(rounded.md) ?? dim(rounded.sm)
    const card = dim(rounded.lg)
    if (control !== undefined) targets.control = control >= 999 ? PILL : control
    if (card !== undefined) targets.card = card
  } else {
    buttonTarget = medianRadius(fam.button)
    targets.control = medianRadius(fam.input) ?? buttonTarget
    targets.card = medianRadius(fam.card)
    targets.surface = medianRadius(fam.surface)
    targets.panel = medianRadius(fam.panel)
  }
  const known = (Object.keys(targets) as ShapeRole[]).filter(
    (role) => targets[role] !== undefined,
  )
  const exactness = (exact: boolean) => statusOf(exact && !fromScale)
  const sourceLabel = fromScale ? " (from the rounded scale)" : ""
  const ROLE_KEY = {
    control: "roleControl",
    card: "roleCard",
    surface: "roleSurface",
    panel: "rolePanel",
  } as const

  let radius: number = DEFAULTS.radiusPx
  if (known.length > 0 && known.every((role) => targets[role] === 0)) {
    const square = SHAPE_CHARACTERS.find((c) => c.id === "square")!.vector
    Object.assign(state, square)
    for (const role of known)
      add(ctx, exactness(true), "shape", {
        id: `radius:${role}`,
        label: `Square ${role}s${sourceLabel}`,
        keys: [ROLE_KEY[role]],
        value: "0px",
        result: "None",
      })
  } else if (known.length > 0) {
    const pillControl = targets.control === PILL
    const fitTargets = { ...targets }
    if (pillControl) delete fitTargets.control
    if (fitTargets.card === PILL) delete fitTargets.card
    if (fitTargets.surface === PILL) delete fitTargets.surface
    if (fitTargets.panel === PILL) delete fitTargets.panel
    const fit = fitRadius(fitTargets)
    radius = fit.radius
    state.radiusPx = radius
    add(ctx, exactness(true), "shape", {
      id: "radius:base",
      label: `Radius base${sourceLabel}`,
      keys: ["radiusPx"],
      result: px(radius),
    })
    if (pillControl) {
      state.roleControl = "full"
      add(ctx, exactness(true), "shape", {
        id: "radius:control",
        label: `Pill controls${sourceLabel}`,
        keys: ["roleControl"],
        value: "pill",
        result: "Pill",
      })
    } else if (fit.rungs.control) state.roleControl = fit.rungs.control
    if (fit.rungs.surface) state.roleSurface = fit.rungs.surface
    const card = fit.rungs.card
    if (fit.rungs.panel) {
      state.rolePanel = fit.rungs.panel
      if (card)
        state.roleCard = card === rungBelow(fit.rungs.panel) ? "auto" : card
    } else if (card) {
      state.rolePanel =
        card === "none"
          ? "none"
          : rungIndex(rungAbove(card)) > rungIndex("3xl")
            ? "3xl"
            : rungAbove(card)
      state.roleCard = "auto"
    }
    for (const role of ["control", "card", "surface", "panel"] as const) {
      const rung = fit.rungs[role]
      const target = fitTargets[role]
      if (!rung || target === undefined) continue
      const fitted = radius * ratioOf(rung)
      const exact = Math.abs(fitted - target) <= 0.5
      add(ctx, exactness(exact), "shape", {
        id: `radius:${role}`,
        label: `${role[0]!.toUpperCase()}${role.slice(1)} radius${sourceLabel}`,
        keys: [ROLE_KEY[role]],
        value: px(target),
        result: rung,
        delta: exact ? undefined : `${px(fitted)} vs ${px(target)}`,
      })
    }
  }

  if (buttonTarget !== undefined) {
    const control = state.roleControl ?? DEFAULTS.roleControl
    const value =
      buttonTarget === PILL && control !== "full"
        ? "pill"
        : buttonTarget === 0 && control !== "none"
          ? "sharp"
          : undefined
    if (value) {
      state.buttonRadius = value
      add(ctx, "mapped", "shape", {
        id: "button-radius",
        label: "Buttons keep their own radius",
        keys: ["buttonRadius"],
        value: buttonTarget === PILL ? "pill" : "0px",
        result: value,
      })
    }
  }

  if (rounded) {
    const ladder = [0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((r) => r * radius)
    for (const [name, value] of Object.entries(rounded)) {
      const v = dim(value)
      if (v === undefined || v === 0 || v >= 999) continue
      if (ladder.every((rung) => Math.abs(rung - v) > 1))
        add(ctx, "unmapped", "shape", {
          id: `radius-token:${kebab(name)}`,
          label: `rounded.${name} is off the generated ladder`,
          source: `rounded.${name}`,
          value: px(v),
        })
    }
  }
}

/* ---------------------------------- space --------------------------------- */

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

function normalizeUnit(unit: number) {
  let u = unit
  while (u < 3) u *= 2
  while (u > 6) u /= 2
  return round(u, 0.25)
}

/** The tier and spacing unit whose md control lands nearest `height`. */
export function fitDensity(
  height: number,
  scaleUnit?: number,
): { density: string; unit: number; control: number } {
  let best:
    | { cost: number; density: string; unit: number; control: number }
    | undefined
  for (const tier of DENSITY_TIERS) {
    for (let k = 12; k <= 24; k++) {
      const unit = k / 4
      const control = tier.control * unit
      const cost =
        Math.abs(control - height) / height +
        (scaleUnit ? Math.abs(unit - scaleUnit) / scaleUnit : 0)
      const better =
        !best ||
        cost < best.cost - 1e-9 ||
        (Math.abs(cost - best.cost) <= 1e-9 &&
          (Math.abs(unit - 4) < Math.abs(best.unit - 4) ||
            (Math.abs(unit - 4) === Math.abs(best.unit - 4) &&
              tier.id === "default")))
      if (better) best = { cost, density: tier.id, unit, control }
    }
  }
  return { density: best!.density, unit: best!.unit, control: best!.control }
}

function controlHeight(fam: Families): number | undefined {
  const heights = (list: Component[]) =>
    median(
      list
        .map((c) => dim(c.props.height))
        .filter((h): h is number => h !== undefined),
    )
  const fromInput = heights(fam.input)
  if (fromInput !== undefined) return fromInput
  const fromButton = heights(fam.button.filter((c) => !SIZE_SUFFIX.test(c.key)))
  if (fromButton !== undefined) return fromButton
  const btn = fam.button[0]
  if (!btn) return
  const padding = box(btn.props.padding)
  if (!padding || padding.top + padding.bottom === 0) return
  const type = isRecord(btn.props.typography) ? btn.props.typography : {}
  const fontSize = dim(btn.props.fontSize ?? type.fontSize)
  if (fontSize === undefined) return
  const lh = btn.props.lineHeight ?? type.lineHeight
  const lineHeight =
    lh === undefined
      ? fontSize * 1.2
      : typeof lh === "number" || /^\d*\.?\d+$/.test(String(lh).trim())
        ? fontSize * Number(lh)
        : (dim(lh) ?? fontSize * 1.2)
  return (
    padding.top + padding.bottom + lineHeight + (hasBorder(btn.props) ? 2 : 0)
  )
}

function mapSpace(ctx: Ctx, fam: Families) {
  const { doc, state } = ctx
  const spacing = isRecord(doc.tokens?.spacing) ? doc.tokens.spacing : undefined
  const values = spacing
    ? Object.entries(spacing)
        .map(([name, value]) => [name, dim(value)] as const)
        .filter(
          (e): e is readonly [string, number] => e[1] !== undefined && e[1] > 0,
        )
    : []

  const layout = doc.sections.layout ?? ""
  const stated =
    /base (spacing )?unit[^0-9\n]{0,20}(\d+(?:\.\d+)?)px/i.exec(layout)?.[2] ??
    /(\d+)px (grid|baseline|spacing scale)/i.exec(layout)?.[1]
  let scaleUnit: number | undefined
  if (stated) scaleUnit = normalizeUnit(Number(stated))
  else {
    const halves = values
      .filter(([, v]) => v <= 128)
      .map(([, v]) => Math.round(v * 2))
    if (halves.length > 0) scaleUnit = normalizeUnit(halves.reduce(gcd) / 2)
  }

  const height = controlHeight(fam)
  let unit = scaleUnit
  if (height !== undefined) {
    const fit = fitDensity(height, scaleUnit)
    unit = fit.unit
    state.density = fit.density
    state.spacingUnit = fit.unit
    const exact = Math.abs(fit.control - height) <= 1
    add(ctx, statusOf(exact), "space", {
      id: "density",
      label: "Density from the control height",
      keys: ["density"],
      value: px(height),
      result: `${fit.density} · ${px(fit.control)} controls`,
      delta: exact ? undefined : `${px(fit.control)} vs ${px(height)}`,
    })
  } else if (scaleUnit !== undefined) state.spacingUnit = scaleUnit

  if (unit !== undefined)
    add(ctx, statusOf(unit === scaleUnit), "space", {
      id: "spacing-unit",
      label:
        scaleUnit === undefined
          ? "Spacing unit fitted to the control height"
          : "Spacing unit from the file's scale",
      keys: ["spacingUnit"],
      value: scaleUnit === undefined ? undefined : px(scaleUnit),
      result: px(unit),
      delta:
        unit === scaleUnit || scaleUnit === undefined
          ? undefined
          : `${px(unit)} vs ${px(scaleUnit)}`,
    })

  if (values.length > 0) {
    const half = (unit ?? DEFAULTS.spacingUnit) / 2
    const off = values.filter(
      ([, v]) => Math.abs(v / half - Math.round(v / half)) > 1e-6,
    )
    add(ctx, statusOf(off.length === 0), "space", {
      id: "spacing-scale",
      label: "Spacing scale on the unit's grid",
      result: `multiples of ${px(half)}`,
      delta:
        off.length === 0
          ? undefined
          : `off grid: ${off.map(([n, v]) => `${n} ${px(v)}`).join(", ")}`,
    })
  }
}

/* -------------------------------- surfaces -------------------------------- */

const CARD_ROW_EXCLUDED =
  /hover|modal|dialog|dropdown|menu|popover|mockup|screenshot|focus|toast|tooltip/i

function tableRows(section: string): string[][] {
  return section
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .filter((line) => !/^\s*\|[\s:|-]+\|?\s*$/.test(line))
    .map((line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
}

const cellShadows = (cell: string) => codeOrText(cell).flatMap(shadows)

const isRing = (layer: ShadowLayer) =>
  layer.x === 0 && layer.y === 0 && layer.blur === 0 && layer.spread === 1

function shadowTier(strength: number) {
  return strength < 0.1
    ? "flat"
    : strength < 0.63
      ? "low"
      : strength < 1.58
        ? "medium"
        : "high"
}

function mapSurfaces(
  ctx: Ctx,
  components: Component[],
  fam: Families,
  { mode, pageL }: ColorResult,
) {
  const { doc, state } = ctx
  const elevation = doc.sections.elevation ?? ""
  const componentsProse = doc.sections.components ?? ""

  // Layers: the card fill against the page, light files only.
  const cardFills = fam.card
    .map((c) => color(c.props.backgroundColor))
    .filter(opaque)
    .map((c) => lstar(c.oklch))
  const cardL = median(cardFills)
  if (mode === "light" && pageL !== undefined && cardL !== undefined) {
    const diff = cardL - pageL
    const layers = Math.abs(diff) < 1 ? "same" : diff > 0 ? "grouped" : "tonal"
    state.surfaceLayers = layers
    add(ctx, layers === "grouped" ? "approximated" : "mapped", "surfaces", {
      id: "surface-layers",
      label:
        layers === "grouped"
          ? "Grouped page kept at the file's L*"
          : layers === "tonal"
            ? "Cards a shade below the page"
            : "Cards on the page's tone",
      keys: ["surfaceLayers"],
      value: `card L* ${cardL.toFixed(1)} · page L* ${pageL.toFixed(1)}`,
      result: layers,
    })
  }

  // Edge: the components' own border vocabulary first, then prose.
  const cardRow = tableRows(elevation).find(
    (cells) =>
      cells.some((cell) => /\bcards?\b/i.test(cell)) &&
      !cells.some((cell) => CARD_ROW_EXCLUDED.test(cell)),
  )
  const cardRowLayers = cardRow?.flatMap(cellShadows) ?? []
  const borderVocab = components.some(
    (c) => "border" in c.props || "borderColor" in c.props,
  )
  let edge: { value: string; exact: boolean } | undefined
  if (borderVocab && fam.card.length > 0)
    edge = {
      value: fam.card.some((c) => hasBorder(c.props)) ? "line" : "none",
      exact: true,
    }
  else {
    for (const sentence of sentences(`${elevation}\n${componentsProse}`)) {
      if (!/\bcards?\b/i.test(sentence)) continue
      if (
        /\b1px\b[^.\n|]{0,40}\b(hairline|border)|hairline border|inset (1 ?px )?hairline|0 0 0 1px/i.test(
          sentence,
        )
      ) {
        edge = { value: "line", exact: false }
        break
      }
      if (/no border|borderless|without borders/i.test(sentence)) {
        edge = { value: "none", exact: false }
        break
      }
    }
    if (!edge && cardRowLayers.some((l) => l.inset && isRing(l)))
      edge = { value: "line", exact: false }
  }
  if (edge) {
    state.surfaceEdge = edge.value
    add(ctx, statusOf(edge.exact), "surfaces", {
      id: "surface-edge",
      label:
        edge.value === "line"
          ? "Cards drawn with a hairline"
          : "Cards without a border",
      source: edge.exact ? "components" : "prose: Elevation & Depth",
      keys: ["surfaceEdge"],
      result: edge.value,
    })
  }

  // Shadow: the elevation table's card row, a card's shadow, then keywords.
  const strengthOf = (layers: ShadowLayer[]) =>
    Math.max(0, ...layers.filter((l) => !l.inset).map(shadowStrength))
  const cardShadow = fam.card
    .map((c) => c.props.shadow)
    .find((s): s is string => typeof s === "string")
  let shadow: { tier: string; exact: boolean; value?: string } | undefined
  if (cardRow)
    shadow = {
      tier: shadowTier(strengthOf(cardRowLayers)),
      exact: true,
      value: cardRow.join(" | "),
    }
  else if (cardShadow)
    shadow = {
      tier: shadowTier(strengthOf(shadows(cardShadow))),
      exact: true,
      value: cardShadow,
    }
  else if (
    /no (drop )?shadows?|shadowless|flat design|resists?[^.]{0,20}shadows|shadows? (are )?(rare|minimal)/i.test(
      elevation,
    )
  )
    shadow = { tier: "flat", exact: false }
  else if (/(subtle|soft|faint) (drop )?shadow/i.test(elevation))
    shadow = { tier: "low", exact: false }
  else if (/(deep|dramatic|heavy|pronounced) shadow/i.test(elevation))
    shadow = { tier: "high", exact: false }
  if (shadow) {
    state.surfaceShadow = shadow.tier
    const full = validate(state)
    const lifted = shadow.tier === "flat" && full.ok && !flatAllowed(full.state)
    if (lifted) state.surfaceShadow = "low"
    add(ctx, statusOf(shadow.exact && !lifted), "surfaces", {
      id: "surface-shadow",
      label: "Card shadow",
      source: shadow.exact
        ? "prose: Elevation & Depth"
        : "prose: Elevation & Depth (keywords)",
      keys: ["surfaceShadow"],
      value: shadow.value,
      result: state.surfaceShadow,
      delta: lifted
        ? "flat lifted to low: cards need an edge or a tone"
        : undefined,
    })
  }

  const parsed = [
    ...tableRows(elevation).flat().flatMap(cellShadows),
    ...[...elevation.matchAll(/`([^`]+)`/g)].flatMap((m) => shadows(m[1]!)),
    ...components
      .map((c) => c.props.shadow)
      .filter((s): s is string => typeof s === "string")
      .flatMap(shadows),
  ]
  if (parsed.length > 0)
    add(ctx, "unmapped", "surfaces", {
      id: "shadow-values",
      label: "Exact shadow recipes and per-level shadows aren't reproduced",
    })
  if (parsed.some((l) => l.color && l.color.c >= 0.02))
    add(ctx, "unmapped", "surfaces", {
      id: "shadow-tint",
      label: "Tinted shadows have no axis",
    })
  if (parsed.some((l) => l.inset && !isRing(l)))
    add(ctx, "unmapped", "surfaces", {
      id: "inset-shadow",
      label: "Inset shadows (bevels) have no axis",
    })

  // Glass: translucent overlays only; a blurred nav bar is reported.
  const glassy = sentences(`${elevation}\n${componentsProse}`).filter((s) =>
    /backdrop-(filter|blur)|frosted|translucent|glass/i.test(s),
  )
  if (glassy.some((s) => /menu|popover|dropdown|tooltip|toast/i.test(s))) {
    state.surfaceGlass = true
    add(ctx, "approximated", "surfaces", {
      id: "surface-glass",
      label: "Translucent menus and popovers",
      keys: ["surfaceGlass"],
      result: "glass",
    })
  } else if (glassy.some((s) => /\b(nav|navigation|navbar|header)\b/i.test(s)))
    add(ctx, "unmapped", "surfaces", {
      id: "backdrop-blur",
      label: "A blurred nav or header has no axis",
    })

  // Input style: the field's fill against the page.
  const input = fam.input.find((c) => c.props.backgroundColor !== undefined)
  const fill = input && color(input.props.backgroundColor)
  if (input && fill) {
    const transparent = fill.alpha === 0
    const delta =
      opaque(fill) && pageL !== undefined
        ? Math.abs(lstar(fill.oklch) - pageL)
        : undefined
    if (transparent || (delta !== undefined && delta < 1))
      add(ctx, "mapped", "components", {
        id: "input-style",
        label: "Outlined fields on the page's tone",
        source: `components.${input.key}`,
        keys: ["inputStyle"],
        result: "outline",
      })
    else if (delta !== undefined && borderVocab && !hasBorder(input.props)) {
      state.inputStyle = "filled"
      add(ctx, "approximated", "components", {
        id: "input-style",
        label: "Filled fields without a border",
        source: `components.${input.key}`,
        keys: ["inputStyle"],
        result: "filled",
      })
    }
  }
}

/* ---------------------------------- prose --------------------------------- */

function mapProse(ctx: Ctx) {
  const { doc, state } = ctx
  const prose = doc.prose

  const icon = /\b(Lucide|Phosphor|Tabler|Remix ?Icon|Hugeicons)\b/i.exec(prose)
  const library =
    icon &&
    LIBRARY_OPTIONS.find(
      (o) => o.value === icon[1]!.toLowerCase().replace(/\s*icon$/, ""),
    )
  if (library) {
    state.iconLibrary = library.value
    add(ctx, "approximated", "icons", {
      id: "icon-library",
      label: "Icon library named in the file",
      keys: ["iconLibrary"],
      value: icon[1],
      result: library.label,
    })
  } else if (
    doc.headings.some(
      (h) => h.section !== "ignored" && /iconograph/i.test(h.text),
    )
  )
    add(ctx, "unmapped", "icons", {
      id: "iconography",
      label: "The file's icon set isn't one the studio ships",
    })

  const linkSentences = sentences(prose).filter(
    (s) => /link/i.test(s) && /underline/i.test(s),
  )
  if (linkSentences.length > 0) {
    const underline = linkSentences.some((s) =>
      /no underline|never underline|without (an )?underline/i.test(s),
    )
      ? "never"
      : linkSentences.some((s) => /hover/i.test(s))
        ? "hover"
        : "always"
    state.linkUnderline = underline
    add(ctx, "approximated", "links", {
      id: "link-underline",
      label: "Link underline from the prose",
      keys: ["linkUnderline"],
      result: underline,
    })
  }

  if (
    /max(imum)? (content )?width|columns?|grid/i.test(doc.sections.layout ?? "")
  )
    add(ctx, "unmapped", "layout", {
      id: "layout-grid",
      label: "Page grid and max width have no axis",
    })
  if (doc.sections.responsive !== undefined)
    add(ctx, "unmapped", "layout", {
      id: "breakpoints",
      label: "Breakpoints have no axis",
    })
  if (/transition|duration|easing|animat/i.test(prose))
    add(ctx, "unmapped", "motion", {
      id: "motion",
      label: "Motion described in prose isn't read",
    })
  if (
    /focus[^.\n]{0,60}\d+px|\d+px[^.\n]{0,40}(focus|ring|outline)/i.test(prose)
  )
    add(ctx, "unmapped", "components", {
      id: "focus-ring",
      label: "The focus ring recipe isn't read",
    })
  if (
    doc.headings.some(
      (h) =>
        h.section !== "ignored" && /photo|illustration|imagery/i.test(h.text),
    )
  )
    add(ctx, "unmapped", "layout", {
      id: "imagery",
      label: "Imagery guidance has no axis",
    })
}

/* ----------------------------------- name --------------------------------- */

export function cleanImportName(raw: string): string {
  const name = raw
    .trim()
    .replace(/[-_ ]?(inspired[-_ ])?design[-_ ]analysis$/i, "")
    .replace(/^design system (inspired by|for)\s+/i, "")
    .replace(/[-_ ]inspired$/i, "")
    .replace(/[-_]+/g, " ")
    .trim()
  return cleanName(name) || "Imported design system"
}

/* ----------------------------------- map ---------------------------------- */

export function mapDesignMd(doc: ParsedDesignMd): DesignMdImport {
  const ctx: Ctx = {
    doc,
    state: {},
    report: { mapped: [], approximated: [], unmapped: [] },
    warnings: [...doc.warnings],
    seen: new Set(),
  }
  const name = doc.title ? cleanImportName(doc.title) : undefined
  const { tokens, source } = readColors(ctx)
  if (source === "none")
    return {
      name,
      state: {},
      report: ctx.report,
      warnings: ctx.warnings,
      source,
    }

  const components = readComponents(doc)
  const fam = families(components)
  const colors = mapColor(ctx, tokens, components)
  mapTypography(ctx, source === "prose")
  mapShape(ctx, components, fam)
  mapSpace(ctx, fam)
  mapSurfaces(ctx, components, fam, colors)
  mapProse(ctx)

  const consumed = new Set(
    Object.values(fam)
      .flat()
      .map((c: Component) => c.key),
  )
  for (const c of components) {
    const base = c.key.replace(STATE_SUFFIX, "")
    if (consumed.has(base) || consumed.has(c.key)) continue
    add(ctx, "unmapped", "components", {
      id: `component-recipe:${kebab(base)}`,
      label: `${base}: its recipe has no axis`,
      source: `components.${base}`,
    })
  }

  if (source === "prose") {
    ctx.report.approximated.push(...ctx.report.mapped)
    ctx.report.mapped = []
  }

  const valid = validate(ctx.state)
  if (!valid.ok)
    for (const issue of valid.issues) {
      delete ctx.state[issue.key as keyof State]
      ctx.warnings.push(`dropped ${issue.key}: ${issue.problem}`)
    }
  return {
    name,
    state: ctx.state,
    report: ctx.report,
    warnings: ctx.warnings,
    source,
  }
}
