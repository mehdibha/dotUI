/* What the interview's tools take and its cards render. Pure — the server
   validates designs and mints the pick; the cards resolve and render them.
   A design is a preset, a shape and axes over them: Claude carries it from
   call to call, since the server keeps nothing. */

import { FONT_CATALOG } from "@/lib/fonts"
import { parseSnapshotInput } from "@/lib/snapshots/parse"
import { snapshotId, stored } from "@/lib/snapshots/snapshot"
import type { SnapshotStore } from "@/lib/snapshots/store"
import { getPreset, PRESET_META } from "@/modules/presets"
import {
  checkKey,
  DEFAULTS,
  FOLLOWS,
  KEY_OWNER,
  SCHEMA,
  validate,
} from "@/modules/studio/axes"
import { OPTIONS } from "@/modules/studio/axes/meta"
import type { AxisSchema } from "@/modules/studio/axes/schema"
import { SHAPES, SHAPE_VALUES } from "@/modules/studio/axes/shape"
import type { ShapeId } from "@/modules/studio/axes/shape"
import { SHAPE_OPTIONS } from "@/modules/studio/axes/shape.meta"

export { SHAPE_VALUES }

/** The identity chapters: what a first-touch interview decides. */
const IDENTITY_CHAPTERS = new Set([
  "style",
  "color",
  "type",
  "icons",
  "shape",
  "space",
  "surfaces",
  "motion",
])

// Per-component motion keys refine Motion; the interview never opens them.
const isIdentityKey = (key: string) =>
  IDENTITY_CHAPTERS.has(KEY_OWNER[key] ?? "") &&
  !(key.endsWith("Motion") && key !== "motion")

/** Keys that differ from the defaults: what a card resolves. */
export type Diff = Record<string, unknown>

export interface DesignInput {
  /** A built-in preset id to start from. */
  preset?: string
  /** A corner look over the preset: the radius and every role together. */
  shape?: ShapeId
  /** Axis values on top. */
  axes?: Record<string, unknown>
}

export interface DirectionInput extends DesignInput {
  name: string
  summary: string
  /** Brand colors to offer when customizing this direction. */
  colors?: Swatch[]
  /** Type pairings to offer when customizing this direction. */
  pairings?: Pairing[]
}

export interface Direction {
  name: string
  summary: string
  diff: Diff
  colors: Swatch[]
  pairings: Array<Pairing & { axes: Diff }>
}

export interface Swatch {
  color: string
  label?: string
}

export interface Pairing {
  name?: string
  heading: string
  body: string
  mono?: string
}

export interface Change {
  key: string
  from: string
  to: string
}

type Result<T> = { ok: true; value: T } | { ok: false; problems: string[] }

const failure = (problems: string[]) => ({ ok: false as const, problems })

const FONT_KEYS = new Set([
  "headingFont",
  "bodyFont",
  "monoFont",
  "readingFont",
])

/** Catalog families like `wanted` — sharing a word with it — so a refused
 *  font comes back with what to use instead. */
function nearFonts(key: string, wanted: unknown): string[] {
  const pool = FONT_CATALOG.filter(
    (font) => key !== "monoFont" || font.category === "mono",
  ).map((font) => font.family)
  const words = String(wanted)
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2)
  const near = pool.filter((family) =>
    words.some((word) => family.toLowerCase().includes(word)),
  )
  return (near.length > 0 ? near : pool).slice(0, 8)
}

const explain = (key: string, problem: string, value: unknown) =>
  FONT_KEYS.has(key) && problem.includes("font catalog")
    ? `${problem}; closest: ${nearFonts(key, value).join(", ")}`
    : problem

/** The preset's diff, the shape, then `axes`, validated. */
export function resolveDesign({
  preset,
  shape,
  axes = {},
}: DesignInput): Result<Diff> {
  const base = preset ? getPreset(preset) : undefined
  if (preset && !base)
    return failure([
      `preset: unknown "${preset}", expected one of ${PRESET_META.map((p) => p.id).join(", ")}`,
    ])
  if (shape && !Object.hasOwn(SHAPES, shape))
    return failure([
      `shape: unknown "${shape}", expected one of ${SHAPE_VALUES.join(", ")}`,
    ])
  const diff: Diff = { ...base?.diff, ...(shape && SHAPES[shape]), ...axes }
  const result = validate(diff)
  if (!result.ok)
    return failure(
      result.issues.map(
        ({ key, problem }) =>
          `${key || "axes"}: ${explain(key, problem, diff[key])}`,
      ),
    )
  return { ok: true, value: diff }
}

/** Every direction validated, with what Customize offers for it: Claude's
 *  colors and pairings, the direction's own first. Problems are prefixed
 *  with the direction. */
export function resolveDirections(
  inputs: DirectionInput[],
): Result<Direction[]> {
  const directions: Direction[] = []
  const problems: string[] = []
  for (const {
    name,
    summary,
    colors = [],
    pairings = [],
    ...design
  } of inputs) {
    const resolved = resolveDesign(design)
    const swatches = resolveSwatches(colors)
    const fonts = resolvePairings(pairings)
    if (!resolved.ok || !swatches.ok || !fonts.ok) {
      for (const result of [resolved, swatches, fonts])
        if (!result.ok)
          problems.push(...result.problems.map((p) => `${name} → ${p}`))
      continue
    }
    const state = validate(resolved.value)
    const own = state.ok ? state.state : undefined
    const ownColor = String(own?.brand ?? DEFAULTS.brand)
    const ownFonts: Pairing = {
      name: "As designed",
      heading: String(
        own?.headingFont === "same" ? own.bodyFont : own?.headingFont,
      ),
      body: String(own?.bodyFont),
      mono: String(own?.monoFont),
    }
    directions.push({
      name,
      summary,
      diff: resolved.value,
      colors: [
        { color: ownColor, label: "As designed" },
        ...swatches.value.filter((s) => s.color !== ownColor),
      ],
      pairings: [ownFonts, ...fonts.value].map((pairing) => ({
        ...pairing,
        axes: pairingAxes(pairing),
      })),
    })
  }
  return problems.length > 0
    ? failure(problems)
    : { ok: true, value: directions }
}

/** Swatches the brand axis accepts. */
export function resolveSwatches(swatches: Swatch[]): Result<Swatch[]> {
  const problems = swatches.flatMap(({ color }, i) => {
    const problem = checkKey("brand", color)
    return problem ? [`candidates[${i}] "${color}": ${problem}`] : []
  })
  return problems.length > 0 ? failure(problems) : { ok: true, value: swatches }
}

/** Pairings whose families the font axes accept. */
export function resolvePairings(pairings: Pairing[]): Result<Pairing[]> {
  const problems = pairings.flatMap(({ heading, body, mono }, i) =>
    (
      [
        ["headingFont", heading],
        ["bodyFont", body],
        ["monoFont", mono],
      ] as const
    ).flatMap(([key, family]) => {
      if (family === undefined) return []
      const problem = checkKey(key, family)
      return problem
        ? [
            `pairings[${i}].${key} "${family}": ${explain(key, problem, family)}`,
          ]
        : []
    }),
  )
  return problems.length > 0 ? failure(problems) : { ok: true, value: pairings }
}

/** A pairing as the axes it sets. */
export const pairingAxes = ({ heading, body, mono }: Pairing): Diff => ({
  headingFont: heading === body ? "same" : heading,
  bodyFont: body,
  ...(mono ? { monoFont: mono } : {}),
})

const show = (key: string, value: unknown): string => {
  const option = OPTIONS[key]?.find((o) => o.value === value)
  if (option) return option.label
  if (value === "" || value === null) return "Auto"
  return String(value)
}

/** The keys whose values differ, as the panel names their values. */
export function compareDesigns(current: Diff, proposed: Diff): Change[] {
  const from = validate(current)
  const to = validate(proposed)
  if (!from.ok || !to.ok) return []
  return Object.keys(SCHEMA)
    .filter(
      (key) =>
        from.state[key as keyof typeof from.state] !==
        to.state[key as keyof typeof to.state],
    )
    .map((key) => ({
      key,
      from: show(key, from.state[key as keyof typeof from.state]),
      to: show(key, to.state[key as keyof typeof to.state]),
    }))
}

function accepts({ value, auto }: AxisSchema): string {
  const empty = auto
    ? ` (or ${value.type === "number" ? "null" : '""'} for auto)`
    : ""
  switch (value.type) {
    case "enum":
      return `one of ${value.values.join(" | ")}`
    case "number":
      return `number ${value.min}–${value.max}${empty}`
    case "boolean":
      return "boolean"
    case "color":
      return `CSS color${empty}`
    case "font":
      return "a family from `fonts`"
  }
}

/** What the model composes designs from: the presets, the corner looks
 *  and the identity axes, with their values and what each value means. */
export function identityCatalog() {
  return {
    presets: PRESET_META.map(({ id, name, description, inspiredBy }) => ({
      id,
      name,
      description,
      ...(inspiredBy ? { inspiredBy } : {}),
    })),
    shapes: Object.fromEntries(
      SHAPE_OPTIONS.map((o) => [o.value, o.description ?? o.label]),
    ),
    fonts: FONT_CATALOG.reduce<Record<string, string[]>>(
      (groups, { family, category }) => {
        ;(groups[category] ??= []).push(family)
        return groups
      },
      {},
    ),
    axes: Object.keys(SCHEMA)
      .filter(isIdentityKey)
      .map((key) => {
        const follows = FOLLOWS[key]?.map((follow) => follow.id)
        const options = OPTIONS[key]
        return {
          key,
          chapter: KEY_OWNER[key],
          default: DEFAULTS[key as keyof typeof DEFAULTS],
          accepts: accepts(SCHEMA[key as keyof typeof SCHEMA]),
          ...(follows?.length ? { alsoAccepts: follows } : {}),
          ...(options
            ? {
                options: Object.fromEntries(
                  options.map((o) => [o.value, o.description ?? o.label]),
                ),
              }
            : {}),
        }
      }),
  }
}

export interface MintedDesignSystem {
  id: string
  name: string
  diff: Diff
  studioUrl: string
  initUrl: string
  v0Url: string
  commands: { npm: string; pnpm: string; bun: string }
}

/** Stores the design system as an immutable snapshot and says how to use it. */
export async function mintDesignSystem(
  input: DesignInput & { name: string },
  store: SnapshotStore,
  origin: string,
): Promise<Result<MintedDesignSystem>> {
  const design = resolveDesign(input)
  if (!design.ok) return design
  const parsed = parseSnapshotInput({ name: input.name, state: design.value })
  if (!parsed.ok)
    return failure(
      parsed.issues.map(({ key, problem }) => `${key}: ${problem}`),
    )
  const id = await snapshotId(parsed.value)
  await store.put(id, JSON.stringify(stored(parsed.value)))
  const base = `${origin}/r/s/${id}`
  const init = `shadcn@latest init ${base}/init.json`
  return {
    ok: true,
    value: {
      id,
      name: parsed.value.name,
      diff: design.value,
      studioUrl: `${origin}/studio?s=${id}`,
      initUrl: `${base}/init.json`,
      v0Url: `https://v0.app/chat/api/open?url=${encodeURIComponent(`${base}/v0.json`)}`,
      commands: {
        npm: `npx ${init}`,
        pnpm: `pnpm dlx ${init}`,
        bun: `bunx --bun ${init}`,
      },
    },
  }
}
