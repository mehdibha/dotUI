/* `check`: what the design system renders to, without a browser. Colors go
   through the same path as the export — the engine's ramps, the semantic
   vocabulary, then the preset's own token re-points — so every hex is a value
   the user ships. */

import { deltaEok, toHex, toOklch, wcag2 } from "@dotui/colors"
import type { Oklch } from "@dotui/colors"

import {
  DEFAULT_COLOR_CONFIG,
  resolveColorConfig,
  semanticLiterals,
  semanticsFor,
} from "@/registry/theme"
import type { ModeName } from "@/registry/theme"
import { colorLookup } from "@/publisher/flatten-color"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import { PRIMARY_LEAVES, primaryValue } from "@/modules/studio/axes/color"
import { roleRadiusPx } from "@/modules/studio/axes/shape"
import type { ShapeRoleKey } from "@/modules/studio/axes/shape"
import { densityTier } from "@/modules/studio/axes/space"
import { diffState } from "@/modules/studio/preset/codec"
import { resolveDesignSystem } from "@/modules/studio/resolve"

/** The `--color-*` tokens reported, by their Tailwind name (`bg-card`,
 *  `text-fg-muted`, `border-border-control`). */
const COLORS = [
  "bg",
  "card",
  "popover",
  "field",
  "border",
  "border-control",
  "fg",
  "fg-muted",
  "fg-accent",
  "primary",
  "fg-on-primary",
  "accent",
  "fg-on-accent",
  "selection",
  "danger",
  "fg-on-danger",
  "success",
  "warning",
  "info",
  "neutral",
  "border-focus",
] as const

const STATUSES = ["success", "warning", "danger", "info"] as const

/* The axes behind each measured color: a failure the design reaches through
   one of these is the design's, however close it lands to the defaults'. */
const COLOR_AXES = ["vividness", "preserveSeed"]
const NEUTRAL_AXES = ["neutralHue", "neutralTint", "modes", "surfaceCanvas"]
const DRIVERS: Record<string, string[]> = {
  primary: ["brand", "buttonColor", ...COLOR_AXES, ...NEUTRAL_AXES],
  accent: ["brand", ...COLOR_AXES],
  "fg-accent": ["brand", "linkColor", ...COLOR_AXES, ...NEUTRAL_AXES],
  danger: ["dangerSeed", ...COLOR_AXES],
  success: ["successSeed", ...COLOR_AXES],
  warning: ["warningSeed", ...COLOR_AXES],
  info: ["infoSeed", ...COLOR_AXES],
  "border-control": ["controlBorder", "modes", "surfaceCanvas"],
}
const driversOf = (token: string) =>
  DRIVERS[token] ??
  DRIVERS[token.replace(/^fg-on-|^fg-|-muted$/g, "")] ??
  NEUTRAL_AXES
const HUE_COLLISION_DEG = 20
/** Two intents need more room than brand vs intent: warning beside danger. */
const INTENT_APART_DEG = 30
/** Below this chroma a hue doesn't read, so it can't collide. */
const CHROMATIC = 0.04
/** Neutral surfaces under this chroma read as pure gray. */
const VISIBLE_TINT = 0.005
/** Past this ΔEok the rendered brand solid visibly differs from the seed. */
const SEED_DRIFT = 0.06

interface Pair {
  fg: string
  bg: string
  /** WCAG 2 minimum; absent = reported, not judged. */
  min?: number
  /** Fills that only need to differ from their surface, not meet a ratio. */
  distinct?: boolean
  what: string
}

/** Below this ratio two fills read as the same color. */
const INDISTINCT = 1.03

function pairs(state: StudioState): Pair[] {
  const link = state.linkColor === "neutral" ? "fg" : "fg-accent"
  return [
    { fg: "fg-on-primary", bg: "primary", min: 4.5, what: "primary labels" },
    { fg: "fg-on-danger", bg: "danger", min: 4.5, what: "danger labels" },
    ...STATUSES.flatMap((status) => [
      ...(status === "danger"
        ? []
        : [
            {
              fg: `fg-on-${status}`,
              bg: status,
              min: 4.5,
              what: `solid ${status} badge labels`,
            },
          ]),
      {
        fg: `fg-${status}`,
        bg: `${status}-muted`,
        min: 4.5,
        what: `soft ${status} badge and alert text`,
      },
    ]),
    { fg: "fg-on-accent", bg: "accent", min: 4.5, what: "accent labels" },
    { fg: "fg", bg: "bg", min: 4.5, what: "body text" },
    { fg: "fg-muted", bg: "card", min: 4.5, what: "muted text on cards" },
    { fg: link, bg: "bg", min: 4.5, what: "link text" },
    {
      fg: "border-control",
      bg: "card",
      min: 3,
      what: "control borders and the off switch track on cards",
    },
    {
      fg: "neutral",
      bg: "card",
      distinct: true,
      what: "neutral fills (muted areas, fields, soft badges, avatars, keycaps) on cards",
    },
    // Only a borderless filled field is identified by its fill alone.
    {
      fg: "field",
      bg: "card",
      min: state.inputStyle === "filled" ? 3 : undefined,
      what: "borderless field fill on cards",
    },
  ]
}

const round = (value: number, digits: number) =>
  Math.round(value * 10 ** digits) / 10 ** digits

function parse(value: string | undefined): Oklch | undefined {
  if (!value || value.includes("color-mix") || value.includes("var(")) return
  try {
    return toOklch(value)
  } catch {
    return undefined
  }
}

const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/** Brand-colored buttons beside neutral selection controls — usually a
 *  half-applied brand move rather than a choice. */
export function primaryWarnings(
  state: StudioState,
  deliberate: ReadonlySet<string> = new Set(),
): string[] {
  if (state.buttonColor !== "accent") return []
  const neutral = PRIMARY_LEAVES.filter(
    (leaf) =>
      leaf !== "linkColor" &&
      leaf !== "focusColor" &&
      !deliberate.has(leaf) &&
      state[leaf] === "neutral",
  )
  if (!neutral.length) return []
  return [
    `Mixed Primary: buttons are accent but ${neutral.join(", ")} ${neutral.length > 1 ? "are" : "is"} still neutral (near-black/white). For a brand-forward system set primaryColor: "accent"; keep the fork only if it is deliberate.`,
  ]
}

type Contrast = { ratio: number; min?: number; pass?: boolean }

function measureMode(
  state: StudioState,
  mode: ModeName,
  read: (name: string, mode: ModeName) => string | undefined,
  neutralRamp: string[],
  seed: Oklch,
) {
  const color = (name: string) => parse(read(name, mode))
  const colors = Object.fromEntries(
    COLORS.map((name) => {
      const value = color(name)
      return [name, value ? toHex(value) : read(name, mode)]
    }),
  )
  const contrast: Record<string, Contrast> = {}
  const failures: Record<
    string,
    { ratio: number; message: string; tokens: string[] }
  > = {}
  for (const pair of pairs(state)) {
    const fg = color(pair.fg)
    const bg = color(pair.bg)
    if (!fg || !bg) continue
    const id = `${pair.fg}/${pair.bg}`
    const ratio = round(wcag2(fg, bg), 2)
    if (pair.distinct) {
      contrast[id] = { ratio }
      if (ratio < INDISTINCT)
        failures[id] = {
          ratio,
          message: `${mode}: ${pair.what} are indistinguishable (${ratio}:1, ${pair.fg} on ${pair.bg})`,
          tokens: [pair.fg, pair.bg],
        }
      continue
    }
    if (pair.min === undefined) {
      contrast[id] = { ratio }
      continue
    }
    const pass = ratio >= pair.min
    contrast[id] = { ratio, min: pair.min, pass }
    if (!pass)
      failures[id] = {
        ratio,
        message: `${mode}: ${pair.what} ${ratio}:1, needs ${pair.min}:1 (${pair.fg} on ${pair.bg})`,
        tokens: [pair.fg, pair.bg],
      }
  }
  const chroma = (name: string) => round(color(name)?.c ?? 0, 4)
  const accent = color("accent")
  return {
    colors,
    contrast,
    neutralChroma: {
      bg: chroma("bg"),
      card: chroma("card"),
      border: chroma("border"),
      ramp: round(
        Math.max(...neutralRamp.map((value) => parse(value)?.c ?? 0)),
        4,
      ),
    },
    brandDeltaE: accent ? round(deltaEok(seed, accent), 3) : undefined,
    failures,
  }
}

function measure(state: StudioState) {
  const system = resolveDesignSystem(state)
  const config = system.color ?? DEFAULT_COLOR_CONFIG
  const engine = resolveColorConfig(config)
  const literals = semanticLiterals(semanticsFor(config), engine)
  const tokens = Object.fromEntries(
    Object.entries(system.tokens).map(([name, value]) => [
      name.startsWith("--") ? name : `--${name}`,
      value,
    ]),
  )
  const lookup = colorLookup(engine, literals, tokens)
  const read = (name: string, mode: ModeName) => lookup(`--color-${name}`, mode)
  const seed = toOklch(config.seeds.accent)
  const ramp = (mode: ModeName) =>
    Object.values(engine[mode].scales.neutral ?? {})
  return {
    read,
    light: measureMode(state, "light", read, ramp("light"), seed),
    dark: measureMode(state, "dark", read, ramp("dark"), seed),
  }
}

/** Light-mode hues of the brand and statuses, and the statuses within
 *  HUE_COLLISION_DEG of a chromatic brand, with how far apart they sit. */
function statusHues(
  read: (name: string, mode: ModeName) => string | undefined,
) {
  const brand = parse(read("accent", "light"))
  const hues: Record<string, number> = {}
  const collisions = new Map<(typeof STATUSES)[number], number>()
  if (brand) hues.brand = round(brand.h || 0, 0)
  for (const name of STATUSES) {
    const status = parse(read(name, "light"))
    if (!status) continue
    hues[name] = round(status.h || 0, 0)
    if (!brand || brand.c < CHROMATIC || status.c < CHROMATIC) continue
    const apart = hueDistance(brand.h, status.h)
    if (apart < HUE_COLLISION_DEG) collisions.set(name, round(apart, 0))
  }
  // Intents must read apart from each other too: warning beside danger.
  const alike: Array<[string, string, number]> = []
  for (const [i, a] of STATUSES.entries())
    for (const b of STATUSES.slice(i + 1)) {
      const x = parse(read(a, "light"))
      const y = parse(read(b, "light"))
      if (!x || !y || x.c < CHROMATIC || y.c < CHROMATIC) continue
      const apart = hueDistance(x.h, y.h)
      if (apart < INTENT_APART_DEG) alike.push([a, b, round(apart, 0)])
    }
  return { hues, collisions, alike }
}

let baseline: Map<string, number> | undefined
/** The default system's own failures: contrast by mode and pair with its
 *  ratio, hue collisions by status with their distance. */
function baselineFailures() {
  if (!baseline) {
    const base = measure(DEFAULTS)
    baseline = new Map([
      ...(["light", "dark"] as const).flatMap((mode) =>
        Object.entries(base[mode].failures).map(
          ([id, { ratio }]) => [`${mode}:${id}`, ratio] as const,
        ),
      ),
      ...[...statusHues(base.read).collisions].map(
        ([name, apart]) => [`hue:${name}`, apart] as const,
      ),
    ])
  }
  return baseline
}

function radius(state: StudioState, key: ShapeRoleKey): number | "full" {
  const px = roleRadiusPx(state, key)
  return px >= 999 ? "full" : round(px, 1)
}

export function checkDesign(state: StudioState) {
  const { read, light, dark } = measure(state)
  const known = baselineFailures()
  const changed = diffState(state)
  const problems: string[] = []
  const inDefaults: string[] = []
  const tradeoffs: string[] = []
  for (const [mode, result] of [
    ["light", light],
    ["dark", dark],
  ] as const)
    for (const [id, { ratio, message, tokens }] of Object.entries(
      result.failures,
    )) {
      // Subtle borders miss 3:1 by design: a look the axis chose, not a bug.
      if (tokens[0] === "border-control" && state.controlBorder === "subtle") {
        tradeoffs.push(
          `${mode}: subtle control borders ${ratio}:1 (WCAG 1.4.11 asks 3:1) — the quiet look; set controlBorder: "strong" only when the brief asks for accessibility`,
        )
        continue
      }
      const floor = known.get(`${mode}:${id}`)
      // Blame the measured color (the label, the border), not its backdrop.
      const touched = driversOf(tokens[0] ?? "").some((axis) => axis in changed)
      // Failing as the defaults do, through axes this design didn't move.
      ;(floor !== undefined && ratio >= floor - 0.05 && !touched
        ? inDefaults
        : problems
      ).push(message)
    }

  const drift = Math.max(light.brandDeltaE ?? 0, dark.brandDeltaE ?? 0)
  if (drift > SEED_DRIFT)
    problems.push(
      `the brand solid renders visibly off its seed (ΔEok ${drift}): the engine re-fits the seed's lightness and chroma, and pulls near-black and near-white seeds toward gray. For the exact hex set preserveSeed (labels may then miss contrast)${
        primaryValue(state) === "neutral"
          ? ""
          : `; for a monochrome brand use primaryColor: "neutral" instead`
      }.`,
    )

  const { hues, collisions } = statusHues(read)
  for (const [name, apart] of collisions) {
    const floor = known.get(`hue:${name}`)
    const touched = ["brand", ...driversOf(name)].some(
      (axis) => axis in changed,
    )
    ;(floor !== undefined && apart >= floor && !touched
      ? inDefaults
      : problems
    ).push(
      `brand and ${name} share a hue (${apart}° apart): ${name} states read as brand — move the ${name} seed at least ${HUE_COLLISION_DEG}° of hue from the brand (lightness or chroma alone doesn't separate them)`,
    )
  }
  for (const [a, b, apart] of statusHues(read).alike)
    problems.push(
      `${a} and ${b} share a hue (${apart}° apart): the two intents read alike — move one seed at least ${INTENT_APART_DEG}° of hue away`,
    )
  const notes = primaryWarnings(state)

  const tier = densityTier(state.density)
  const unit = state.spacingUnit
  const controlHeight = round(tier.control * unit, 2)
  const capsule = (px: number | "full") =>
    px === "full" || px >= controlHeight / 2 ? "full" : px
  const control = capsule(radius(state, "roleControl"))
  const button =
    state.buttonRadius === "sharp"
      ? 0
      : state.buttonRadius === "round"
        ? capsule(state.radiusPx)
        : state.buttonRadius === "pill"
          ? "full"
          : control
  const strip = ({ failures: _, ...mode }: typeof light) => mode

  return {
    light: strip(light),
    dark: strip(dark),
    neutralTinted: {
      light:
        Math.max(light.neutralChroma.bg, light.neutralChroma.card) >=
        VISIBLE_TINT,
      dark:
        Math.max(dark.neutralChroma.bg, dark.neutralChroma.card) >=
        VISIBLE_TINT,
    },
    hues,
    size: {
      density: tier.id,
      unitPx: unit,
      controlHeightPx: controlHeight,
      controlTextPx: tier.textPx,
    },
    radiusPx: {
      base: state.radiusPx,
      control,
      button,
      item: radius(state, "roleItem"),
      surface: radius(state, "roleSurface"),
      panel: radius(state, "rolePanel"),
    },
    problems,
    inDefaults,
    ...(tradeoffs.length ? { tradeoffs } : {}),
    ...(notes.length ? { notes } : {}),
  }
}
