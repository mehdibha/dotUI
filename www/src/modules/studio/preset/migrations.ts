/* How strings from older codec versions reach today's state. A version's
   diff decodes against that version's frozen defaults (baselines/*.json,
   recovered from git history — never the live DEFAULTS), then MIGRATIONS
   lift the full state one version at a time. A setting with no successor is
   named in `dropped` unless it was still at its old default. */

import { toOklch } from "@dotui/colors"

import { familyFromStack } from "@/lib/fonts"
import type { CodeOptions } from "@/publisher/code-options"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import { SOLID_LEAVES, withSource } from "@/modules/studio/axes/color"

import legacy from "./baselines/legacy.json"
import v3 from "./baselines/v3.json"
import v4 from "./baselines/v4.json"

type State = Record<string, unknown>

export interface Baseline {
  state: State
  codeOptions: CodeOptions
}

type Migration = (state: State, dropped: string[]) => State

const FIRST = 3

export const BASELINES: Record<number, Baseline> = { 3: v3, 4: v4 }

export const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b)

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

/** `table[key]`, never an inherited property. */
const own = <T>(table: Record<string, T>, key: string): T | undefined =>
  Object.hasOwn(table, key) ? table[key] : undefined

/** Carries `state` onto the next version's keys; a key it no longer has is
 *  dropped, and named unless it still held `from`'s default. */
function carry(state: State, from: State, to: State, dropped: string[]) {
  const next = { ...to }
  for (const [key, value] of Object.entries(state)) {
    if (Object.hasOwn(to, key)) next[key] = value
    else if (!same(value, from[key])) dropped.push(key)
  }
  return next
}

/* ---------------------------------- v3 ---------------------------------- */

const SPEED: Record<string, number> = { fast: 0.75, default: 1, relaxed: 1.4 }
const DEPTHS = ["flat", "subtle", "raised", "floating"]
/** The controls v3's `checkFill` re-pointed: the selection tokens' users. */
const CHECK_LEAVES = [
  "checkboxColor",
  "radioColor",
  "switchColor",
  "selectionColor",
] as const

/**
 * v3 → v4 (#766). `primary` painted every solid (buttons, selection tokens,
 * checks, the slider); `checkFill: "accent"` re-pointed the selection tokens
 * only. `mobileAdapt: false` rendered popover pickers and centered dialogs.
 * Outline became hairline one depth up — its shadow ladder and dark
 * elevation are hairline's shifted by one rung (Linear moved from outline ·
 * subtle to hairline · raised). Type scale, corner shape, shadow character,
 * edge, contrast policy and hue shift have no successor.
 */
function v3ToV4(raw: State, dropped: string[]): State {
  const { primary, checkFill, mobileAdapt, motionSpeed, ...state } = raw
  if (primary !== "neutral" && primary !== "accent") dropped.push("primary")
  Object.assign(
    state,
    withSource(SOLID_LEAVES, primary === "accent" ? "accent" : "neutral"),
  )
  if (checkFill === "accent")
    Object.assign(state, withSource(CHECK_LEAVES, "accent"))
  else if (checkFill !== "neutral") dropped.push("checkFill")
  if (state.linkColor === "foreground") state.linkColor = "neutral"

  const speed = typeof motionSpeed === "string" && own(SPEED, motionSpeed)
  if (speed) state.motionSpeed = speed
  else dropped.push("motionSpeed")

  if (mobileAdapt === false) {
    state.mobilePickers = "popover"
    state.mobileDialogs = "center"
  } else if (mobileAdapt !== true) dropped.push("mobileAdapt")

  if (state.surfaceStrategy === "outline") {
    const depth = Math.max(0, DEPTHS.indexOf(state.surfaceDepth as string))
    state.surfaceStrategy = "hairline"
    state.surfaceDepth = DEPTHS[Math.min(depth + 1, DEPTHS.length - 1)]
  }

  if (Array.isArray(state.modes))
    state.modes = state.modes.map((mode) => {
      if (!isRecord(mode)) return mode
      const { contrast, ...rest } = mode
      if (contrast !== "default" && !dropped.includes("modes.contrast"))
        dropped.push("modes.contrast")
      return rest
    })

  return carry(state, v3.state, v4.state, dropped)
}

/** MIGRATIONS[i] lifts a full state from version FIRST + i to the next.
 *  Append-only: removing or renaming an axis or an option adds one. */
export const MIGRATIONS: Migration[] = [v3ToV4]

export const VERSION = FIRST + MIGRATIONS.length

/** A full state of version `from`, lifted to VERSION. */
export function migrate(state: State, from: number, dropped: string[]) {
  let lifted = state
  for (let version = from; version < VERSION; version++)
    lifted = (MIGRATIONS[version - FIRST] as Migration)(lifted, dropped)
  return lifted
}

/** The current version's frozen defaults; a key added since takes its live
 *  default (an addition must not change the look of older strings). */
export function currentBaseline(frozen: State = v4.state): StudioState {
  const state: State = { ...DEFAULTS }
  for (const key of Object.keys(DEFAULTS))
    if (Object.hasOwn(frozen, key)) state[key] = frozen[key]
  return state as StudioState
}

/* -------------------------------- legacy -------------------------------- */

/**
 * The pre-studio compact shape (a diffed resolved design system):
 *   p = component params · t = global tokens · d = density · c = color
 *   recipe · o = code options · i = icon library
 */
export interface LegacyState {
  p?: unknown
  t?: Record<string, string>
  d?: unknown
  c?: unknown
  o?: unknown
  i?: unknown
}

export const LEGACY_CODE_OPTIONS: CodeOptions = legacy.codeOptions

const table = (values: Record<string, string>) => (value: string) =>
  own(values, value)

const radius =
  (full: string, rest: string, square = rest) =>
  (value: string) =>
    value === "--radius-full"
      ? full
      : value === "--radius-none" || value === "--radius-xs"
        ? square
        : rest

/** Legacy component params with a successor axis, and how each value maps.
 *  A value mapping to nothing is dropped. */
const PARAMS: Record<
  string,
  { axis: keyof StudioState; map: (value: string) => string | undefined }
> = {
  "avatar.radius": { axis: "avatarShape", map: radius("circle", "rounded") },
  "badge.radius": { axis: "badgeShape", map: radius("pill", "rounded") },
  "checkbox.radius": {
    axis: "checkCorner",
    map: radius("circle", "rounded", "square"),
  },
  "command.style": {
    axis: "menuSearch",
    map: table({ 1: "field", 2: "bar", 3: "bar" }),
  },
  "input.style": { axis: "inputStyle", map: (value) => value },
  "list-box.highlight": {
    axis: "menuHighlight",
    map: table({ subtle: "neutral", accent: "accent" }),
  },
  "menu.highlight": {
    axis: "menuHighlight",
    map: table({ subtle: "neutral", accent: "accent" }),
  },
  "loader.style": {
    axis: "spinnerStyle",
    map: table({ ring: "ring" }),
  },
  "skeleton.animation": { axis: "skeletonAnimation", map: (value) => value },
  "slider.thumb-style": {
    axis: "sliderThumb",
    map: table({ solid: "circle", outline: "outline", bar: "bar" }),
  },
}

function legacyParams(p: unknown, state: State, dropped: string[]) {
  const apply = (component: string, params: unknown, fromDiff: boolean) => {
    if (!isRecord(params)) return dropped.push(`p.${component}`)
    for (const [param, value] of Object.entries(params)) {
      const rule = own(PARAMS, `${component}.${param}`)
      const mapped = typeof value === "string" ? rule?.map(value) : undefined
      if (rule && mapped !== undefined) state[rule.axis] = mapped
      else if (fromDiff) dropped.push(`p.${component}.${param}`)
    }
  }
  for (const [component, params] of Object.entries(legacy.componentParams))
    apply(component, params, false)
  if (p === undefined) return
  if (!isRecord(p)) return dropped.push("p")
  for (const [component, params] of Object.entries(p))
    apply(component, params, true)
}

const length = (value: string): number | undefined => {
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return undefined
  return value.trim().endsWith("rem") ? parsed * 16 : parsed
}

/** Global tokens with a successor axis, and how each value parses. */
const TOKENS: Record<string, [keyof StudioState, (value: string) => unknown]> =
  {
    "--radius": ["radiusPx", length],
    // #575: the ladder's factor f became a base length of 0.5rem × f.
    "--radius-factor": [
      "radiusPx",
      (value) => {
        const factor = Number.parseFloat(value)
        return Number.isFinite(factor)
          ? factor * legacy.radiusFactorPx
          : undefined
      },
    ],
    "--font-sans": ["bodyFont", familyFromStack],
    "--font-heading": ["headingFont", familyFromStack],
    "--font-mono": ["monoFont", familyFromStack],
    "--icon-stroke-width": ["iconStroke", length],
    "--icon-weight": ["iconWeight", (value) => value],
    "--cursor-interactive": ["cursorControls", (value) => value],
    "--cursor-disabled": ["cursorDisabled", (value) => value],
  }

function legacyTokens(
  tokens: Record<string, string>,
  state: State,
  dropped: string[],
) {
  for (const [name, value] of Object.entries(tokens)) {
    const [key, parse] = own(TOKENS, name) ?? []
    const parsed = parse?.(value)
    if (key && parsed !== undefined) state[key] = parsed
    else dropped.push(`t.${name}`)
  }
}

/** #715's reading of a measured gray: its hue, or no tint when it has none. */
function neutralFromSeed(seed: unknown): State | undefined {
  if (typeof seed !== "string") return undefined
  try {
    const { c, h } = toOklch(seed)
    return c < 0.001 ? { neutralTint: 0 } : { neutralHue: Math.round(h ?? 0) }
  } catch {
    return undefined
  }
}

const V1_FIELDS = new Set(["algorithm", "seeds", "knobs", "primary"])
const V2_FIELDS = new Set([
  "v",
  "seeds",
  "background",
  "vividness",
  "hueShift",
  "neutralTint",
  "neutralHue",
  "preserveSeed",
  "primary",
])
const SEEDS: Record<string, string> = {
  accent: "brand",
  selection: "selectionSeed",
  success: "successSeed",
  warning: "warningSeed",
  danger: "dangerSeed",
}

/** A present recipe replaced the default one whole: an unset background is
 *  the engine's, not dotUI's default. */
function legacyColor(c: unknown, state: State, dropped: string[]) {
  if (!isRecord(c)) return dropped.push("c")
  const v1 = c.v !== 2
  for (const field of Object.keys(c))
    if (!(v1 ? V1_FIELDS : V2_FIELDS).has(field)) dropped.push(`c.${field}`)

  const seeds = isRecord(c.seeds) ? c.seeds : {}
  for (const [seed, value] of Object.entries(seeds)) {
    if (seed === "neutral") continue
    const key = own(SEEDS, seed)
    if (key) state[key] = value
    else if (seed !== "info" || value !== legacy.infoSeed)
      dropped.push(`c.seeds.${seed}`)
  }
  if (c.primary !== undefined) state.primary = c.primary

  if (v1) {
    if (c.algorithm !== undefined && c.algorithm !== "oklch")
      dropped.push("c.algorithm")
    const { chromaMult, hueTorsion, ...rest } = isRecord(c.knobs) ? c.knobs : {}
    if (chromaMult !== undefined) state.vividness = chromaMult
    if (typeof hueTorsion === "number" && hueTorsion !== 0)
      state.hueShift = Math.abs(hueTorsion) / 15
    for (const knob of Object.keys(rest)) dropped.push(`c.knobs.${knob}`)
  } else {
    for (const key of [
      "vividness",
      "hueShift",
      "neutralTint",
      "neutralHue",
      "preserveSeed",
    ])
      if (c[key] !== undefined) state[key] = c[key]
  }

  if (seeds.neutral !== undefined) {
    const neutral =
      c.neutralHue === undefined && c.neutralTint === undefined
        ? neutralFromSeed(seeds.neutral)
        : undefined
    if (neutral) Object.assign(state, neutral)
    else dropped.push("c.seeds.neutral")
  }

  const background = isRecord(c.background) ? c.background : {}
  if (c.background !== undefined && !isRecord(c.background))
    dropped.push("c.background")
  state.modes = (v3.state.modes as Array<{ polarity: "light" | "dark" }>).map(
    (mode) => {
      const bg =
        background[mode.polarity] ?? legacy.engineBackground[mode.polarity]
      return { ...mode, bg: bg === "oled" ? 0 : bg }
    },
  )
}

/** A legacy string as a full v3 state, which the chain then lifts. */
export function fromLegacy(raw: LegacyState, dropped: string[]): State {
  const state: State = { ...v3.state }
  const tokens = raw.t ?? {}
  legacyParams(raw.p, state, dropped)
  // Before #575 (a v1 recipe or a radius factor) the unset base was 8px.
  const preLadder =
    "--radius-factor" in tokens || (isRecord(raw.c) && raw.c.v !== 2)
  if (preLadder && !("--radius" in tokens))
    state.radiusPx = legacy.radiusFactorPx
  legacyTokens(tokens, state, dropped)
  if (raw.d !== undefined) state.density = raw.d
  if (raw.c !== undefined) legacyColor(raw.c, state, dropped)
  if (raw.i !== undefined) state.iconLibrary = raw.i
  return state
}
