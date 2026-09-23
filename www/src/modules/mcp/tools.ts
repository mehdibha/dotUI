/* The MCP tools as pure functions over the preset string. The server holds no
   state: every call takes the design system as `preset` (the same compact
   string /studio carries in `?preset=`) and returns the next one. */

import { FONT_CATALOG } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import {
  DEFAULT_CODE_OPTIONS,
  sanitizeCodeOptions,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"
import {
  buildInitCommands,
  buildInstallCommands,
} from "@/modules/docs/install-commands"
import { PRESETS } from "@/modules/presets/presets-data"
import { CATALOG, DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import {
  PRIMARY_LEAVES,
  primaryValue,
  SOURCE_OPTIONS,
} from "@/modules/studio/axes/color"
import { checkAxisValue } from "@/modules/studio/axes/spec"
import type { AxisSpec } from "@/modules/studio/axes/spec"
import {
  decodePresetStrict,
  diffState,
  encodePreset,
} from "@/modules/studio/preset/codec"
import type { StudioPreset } from "@/modules/studio/preset/codec"
import { AVAILABLE_BLOCKS } from "@/modules/studio/preview/blocks"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { checkDesign, primaryWarnings } from "./check"

export class ToolError extends Error {}

/** Not stored: a write-only key that fans out to every Primary leaf, as the
 *  studio's Primary view does. */
const PRIMARY_KEY = "primaryColor"

const PRIMARY_SPEC: AxisSpec = {
  label: "Primary",
  description:
    `Shortcut, not stored: sets every Primary leaf (${PRIMARY_LEAVES.join(", ")}) ` +
    'to one source; "mixed" in get_design means the leaves differ. Leaves ' +
    "set in the same call win.",
  value: { type: "enum", options: SOURCE_OPTIONS },
  guidance:
    "Accent is the brand-forward system (Material 3, Radix Themes): brand " +
    "buttons, checks, switch, slider, tabs, links and focus. Neutral is the " +
    "tool-UI school (shadcn/ui): near-black solids. The default is " +
    "neither: neutral solids with accent links and focus ring. Geist is a " +
    "deliberate mix (neutral buttons and checkbox, accent switch): set " +
    "primaryColor, then the leaves that differ.",
}

const AXES = new Map<string, { chapter: string; spec: AxisSpec }>([
  ...CATALOG.flatMap((chapter) =>
    Object.entries(chapter.axes).map(
      ([key, spec]) => [key, { chapter: chapter.id, spec }] as const,
    ),
  ),
  [PRIMARY_KEY, { chapter: "color", spec: PRIMARY_SPEC }],
])

const chapterAxes = (chapter: (typeof CATALOG)[number]) =>
  Object.entries(chapter.axes).concat(
    chapter.id === "color" ? [[PRIMARY_KEY, PRIMARY_SPEC]] : [],
  )

/** primaryColor is a shortcut over the leaves, so it has no default. */
const defaultOf = (key: string) =>
  key === PRIMARY_KEY ? null : DEFAULTS[key as keyof StudioState]

/** A preset that fails to decode is an error, never the default system: a
 *  one-character typo would otherwise wipe every decision silently. */
function decode(preset: string | undefined): StudioPreset {
  if (!preset) return { state: DEFAULTS }
  try {
    return decodePresetStrict(preset)
  } catch {
    throw new ToolError(
      "The preset could not be decoded — it was probably mistyped or truncated. Pass the exact `preset` string the last successful call returned.",
    )
  }
}

const encode = (preset: StudioPreset) => encodePreset(preset) ?? ""

/** The preset re-encoded: validated, and the same string for the same system. */
export const canonicalPreset = (preset?: string) => encode(decode(preset))

const same = (a: unknown, b: unknown) =>
  a === b || JSON.stringify(a) === JSON.stringify(b)

/* --------------------------------- links --------------------------------- */

export const PREVIEW_PAGES = [
  "overview",
  ...AVAILABLE_BLOCKS.map((block) => block.slug),
]

/** The preset is URL-safe as encoded; params with no value are dropped. */
const withQuery = (url: string, params: Record<string, string>) => {
  const query = Object.entries(params)
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}=${value}`)
    .join("&")
  return query ? `${url}?${query}` : url
}

export const previewUrl = (
  origin: string,
  preset: string,
  page: string,
  mode: string,
) => withQuery(`${origin}/preview/${page}`, { preset, mode })

function links(origin: string, preset: string) {
  return {
    studio: withQuery(`${origin}/studio`, { preset }),
    preview: withQuery(`${origin}/preview/overview`, { preset }),
  }
}

/* ------------------------------- list_axes ------------------------------- */

const firstSentence = (text: string) =>
  /^.*?[.!?](?=\s|$)/.exec(text)?.[0] ?? text

/** The value's vocabulary, flat: enum values, or a number's range. */
function valueShape(key: string, spec: AxisSpec) {
  const value = spec.value
  if (key === PRIMARY_KEY && value.type === "enum")
    return { type: "shortcut", values: value.options.map((o) => o.value) }
  switch (value.type) {
    case "enum":
      return { type: "enum", values: value.options.map((o) => o.value) }
    case "number":
      return {
        type: "number",
        min: value.min,
        max: value.max,
        step: value.step,
        ...(value.unit ? { unit: value.unit } : {}),
      }
    case "json":
      return { type: "json", shape: value.shape }
    default:
      return { type: value.type }
  }
}

/** The axis's traps: its own caution, and each cautioned option's by value. */
function cautions(spec: AxisSpec) {
  const options =
    spec.value.type === "enum"
      ? spec.value.options.filter((option) => option.caution)
      : []
  return {
    ...(spec.caution ? { caution: spec.caution } : {}),
    ...(options.length
      ? {
          cautions: Object.fromEntries(
            options.map((option) => [option.value, option.caution]),
          ),
        }
      : {}),
  }
}

const overviewEntry = (key: string, spec: AxisSpec) => ({
  key,
  label: spec.label,
  ...valueShape(key, spec),
  default: defaultOf(key),
  ...(key === PRIMARY_KEY
    ? { description: firstSentence(spec.description) }
    : {}),
  ...cautions(spec),
})

const briefEntry = (key: string, spec: AxisSpec) => ({
  key,
  label: spec.label,
  ...valueShape(key, spec),
  default: defaultOf(key),
  ...(spec.auto !== undefined ? { auto: firstSentence(spec.auto) } : {}),
  description: firstSentence(spec.description),
  ...cautions(spec),
})

/** The caution a chosen option springs. Axis-level cautions describe the
 *  axis, not a value, so the overview shows them and set_axes doesn't. */
function cautionFor(spec: AxisSpec | undefined, value: unknown) {
  if (spec?.value.type === "enum")
    return spec.value.options.find((option) => option.value === value)?.caution
}

const fullEntry = (key: string, spec: AxisSpec) => ({
  key,
  ...spec,
  default: defaultOf(key),
})

type Entry = { key: string } & Record<string, unknown>

/** Every chapter with each axis's key, values and default. */
export function axisOverview() {
  return {
    chapters: CATALOG.map((chapter) => ({
      id: chapter.id,
      label: chapter.label,
      description: firstSentence(chapter.description),
      axes: chapterAxes(chapter).map(([key, spec]) => overviewEntry(key, spec)),
    })),
  }
}

export function axisChapters(ids: string[], detail: "brief" | "full") {
  const unknown = ids.filter(
    (id) => !CATALOG.some((chapter) => chapter.id === id),
  )
  if (unknown.length)
    throw new ToolError(
      `Unknown chapter: ${unknown.join(", ")}. Chapters: ${CATALOG.map((c) => c.id).join(", ")}`,
    )
  const entry: (key: string, spec: AxisSpec) => Entry =
    detail === "full" ? fullEntry : briefEntry
  return {
    chapters: CATALOG.filter((chapter) => ids.includes(chapter.id)).map(
      (chapter) => ({
        id: chapter.id,
        label: chapter.label,
        description: chapter.description,
        axes: chapterAxes(chapter).map(([key, spec]) => entry(key, spec)),
        ...(chapter.recipes
          ? {
              recipes:
                detail === "full"
                  ? chapter.recipes
                  : chapter.recipes.map(({ id, set }) => ({ id, set })),
            }
          : {}),
      }),
    ),
  }
}

export function axisDetails(keys: string[]) {
  const unknown = keys.filter((key) => !AXES.has(key))
  if (unknown.length)
    throw new ToolError(
      unknown
        .map((key) => {
          const near = closest(key)
          return `Unknown axis: ${key}${near.length ? ` (did you mean ${near.join(", ")}?)` : ""}`
        })
        .join("\n"),
    )
  return {
    axes: keys.map((key) => {
      const { chapter, spec } = AXES.get(key)!
      return { chapter, ...fullEntry(key, spec) }
    }),
  }
}

export function listAxes(
  input: {
    chapters?: string[]
    axes?: string[]
    detail?: "brief" | "full"
  } = {},
) {
  if (input.axes?.length) return axisDetails(input.axes)
  if (input.chapters?.length)
    return axisChapters(input.chapters, input.detail ?? "brief")
  return axisOverview()
}

/* ------------------------------- get_design ------------------------------ */

/** The axes off their defaults, by chapter. */
function nonDefault(state: StudioState) {
  const byChapter: Record<string, Record<string, unknown>> = {}
  for (const [key, value] of Object.entries(diffState(state))) {
    const chapter = AXES.get(key)?.chapter ?? "other"
    ;(byChapter[chapter] ??= {})[key] = value
  }
  return byChapter
}

export function getDesign(origin: string, preset?: string) {
  const decoded = decode(preset)
  const encoded = encode(decoded)
  return {
    preset: encoded,
    nonDefault: nonDefault(decoded.state),
    primaryColor: primaryValue(decoded.state),
    codeOptions: decoded.codeOptions ?? DEFAULT_CODE_OPTIONS,
    links: links(origin, encoded),
  }
}

/* ------------------------------- set_axes -------------------------------- */

function closest(key: string): string[] {
  const needle = key.toLowerCase()
  return [...AXES.keys()]
    .filter(
      (candidate) =>
        candidate.toLowerCase().includes(needle) ||
        needle.includes(candidate.toLowerCase()),
    )
    .slice(0, 5)
}

type Change = { from?: string; to?: string }

/* Builder-only `--studio-*` vars never ship (the publisher resolves them into
   plain utilities), so they surface as the param they drive. */
const STUDIO_COMPONENTS: Record<string, string> = { btn: "button" }

function studioParam(name: string): [string, string] | undefined {
  const role = /^--studio-radius-(\w+)$/.exec(name)
  if (role?.[1]) return ["radius-role", role[1]]
  const own = /^--studio-([\w-]+?)-(radius|fill-color)$/.exec(name)
  if (own?.[1] && own[2])
    return [
      STUDIO_COMPONENTS[own[1]] ?? own[1],
      own[2] === "fill-color" ? "fill" : "radius",
    ]
}

const studioValue = (value: string | undefined) =>
  value === "0"
    ? "none"
    : value?.replace(/^var\(--(?:radius|color)-([\w-]+)\)$/, "$1")

/** What moved in the resolved system: the tokens, params and engine inputs. */
function effects(before: StudioState, after: StudioState) {
  const a = resolveDesignSystem(before)
  const b = resolveDesignSystem(after)
  const tokens: Record<string, Change> = {}
  const params: Record<string, Record<string, Change>> = {}
  for (const component of new Set([
    ...Object.keys(a.componentParams),
    ...Object.keys(b.componentParams),
  ])) {
    const from = a.componentParams[component] ?? {}
    const to = b.componentParams[component] ?? {}
    for (const param of new Set([...Object.keys(from), ...Object.keys(to)]))
      if (from[param] !== to[param])
        (params[component] ??= {})[param] = {
          from: from[param],
          to: to[param],
        }
  }
  for (const name of new Set([
    ...Object.keys(a.tokens),
    ...Object.keys(b.tokens),
  ])) {
    if (a.tokens[name] === b.tokens[name]) continue
    if (!name.startsWith("--studio-")) {
      tokens[name] = { from: a.tokens[name], to: b.tokens[name] }
      continue
    }
    const target = studioParam(name)
    if (target)
      (params[target[0]] ??= {})[target[1]] = {
        from: studioValue(a.tokens[name]),
        to: studioValue(b.tokens[name]),
      }
  }
  return {
    tokens,
    params,
    ...(a.density !== b.density ? { density: b.density } : {}),
    ...(a.icons !== b.icons ? { icons: b.icons ?? "lucide" } : {}),
    colorChanged: JSON.stringify(a.color) !== JSON.stringify(b.color),
  }
}

export function setAxes(input: {
  preset?: string
  set?: Record<string, unknown>
  reset?: string[]
  codeOptions?: Partial<CodeOptions>
}) {
  const decoded = decode(input.preset)
  const before = decoded.state
  const errors: string[] = []
  const next: Record<string, unknown> = { ...before }
  const noop: string[] = []

  for (const target of input.reset ?? []) {
    const chapter = CATALOG.find((c) => c.id === target)
    const keys =
      target === "all"
        ? Object.keys(DEFAULTS)
        : chapter
          ? Object.keys(chapter.axes)
          : target === PRIMARY_KEY
            ? [...PRIMARY_LEAVES]
            : AXES.has(target)
              ? [target]
              : undefined
    if (!keys) {
      errors.push(`reset: unknown axis or chapter "${target}"`)
      continue
    }
    for (const key of keys) next[key] = DEFAULTS[key as keyof StudioState]
  }

  const { [PRIMARY_KEY]: primary, ...set } = input.set ?? {}
  if (primary !== undefined) {
    const problem = checkAxisValue(PRIMARY_SPEC, primary)
    if (problem)
      errors.push(`${PRIMARY_KEY}: ${problem}, got ${JSON.stringify(primary)}`)
    else {
      if (PRIMARY_LEAVES.every((leaf) => before[leaf] === primary))
        noop.push(PRIMARY_KEY)
      for (const leaf of PRIMARY_LEAVES)
        if (!(leaf in set)) next[leaf] = primary
    }
  }

  for (const [key, value] of Object.entries(set)) {
    const axis = AXES.get(key)
    if (!axis) {
      const near = closest(key)
      errors.push(
        `${key}: unknown axis${near.length ? ` (did you mean ${near.join(", ")}?)` : ""}`,
      )
      continue
    }
    const problem = checkAxisValue(axis.spec, value)
    if (problem) {
      errors.push(`${key}: ${problem}, got ${JSON.stringify(value)}`)
      continue
    }
    if (same(before[key as keyof StudioState], value)) noop.push(key)
    next[key] = value
  }

  if (errors.length)
    throw new ToolError(
      `${errors.join("\n")}\nNothing was applied. Every other key in this call was valid: resend the same call with only these fixed.`,
    )

  const state = next as StudioState
  const codeOptions = input.codeOptions
    ? sanitizeCodeOptions({
        ...(decoded.codeOptions ?? DEFAULT_CODE_OPTIONS),
        ...input.codeOptions,
      })
    : decoded.codeOptions
  const encoded = encode({ state, codeOptions })
  const applied: Record<string, { from: unknown; to: unknown }> = {}
  for (const key of Object.keys(DEFAULTS) as (keyof StudioState)[])
    if (!same(before[key], state[key]))
      applied[key] = { from: before[key], to: state[key] }
  const moved = effects(before, state)
  const problems = moved.colorChanged ? checkDesign(state).problems : []
  const explicit = new Set(Object.keys(input.set ?? {}))
  const forked =
    explicit.has("buttonColor") || explicit.has(PRIMARY_KEY)
      ? primaryWarnings(state, explicit)
      : []
  const cautioned = Object.entries(set).flatMap(([key, value]) => {
    const caution = key in applied && cautionFor(AXES.get(key)?.spec, value)
    return caution ? [`${key} ${JSON.stringify(value)}: ${caution}`] : []
  })
  const warnings = [...new Set([...forked, ...cautioned, ...problems])]
  return {
    preset: encoded,
    applied,
    ...(noop.length ? { noop } : {}),
    ...(warnings.length ? { warnings } : {}),
    effects: moved,
    nonDefault: nonDefault(state),
  }
}

/* --------------------------------- check --------------------------------- */

export function check(preset?: string) {
  return checkDesign(decode(preset).state)
}

/* ------------------------------ list_presets ----------------------------- */

export function listPresets() {
  return {
    presets: PRESETS.map((preset) => ({
      id: preset.id,
      name: preset.name,
      description: preset.description,
      preset: encode({ state: preset.state }),
    })),
  }
}

/* ------------------------------- list_fonts ------------------------------ */

export function listFonts(
  input: { category?: FontCategory; query?: string; limit?: number } = {},
) {
  const { category, limit = 30 } = input
  const needle = input.query?.toLowerCase()
  const named = FONT_CATALOG.filter(
    (font) => !needle || font.family.toLowerCase().includes(needle),
  )
  const fonts = named.filter((font) => !category || font.category === category)
  const elsewhere = needle
    ? named.filter((font) => category && font.category !== category)
    : []
  const entry = (font: (typeof FONT_CATALOG)[number]) => ({
    family: font.family,
    category: font.category,
  })
  return {
    fonts: fonts.slice(0, limit).map(entry),
    ...(fonts.length > limit ? { more: fonts.length - limit } : {}),
    ...(elsewhere.length
      ? { otherCategories: elsewhere.slice(0, limit).map(entry) }
      : {}),
  }
}

/* ------------------------------ preview_urls ----------------------------- */

export function previewUrls(origin: string, preset?: string, pages?: string[]) {
  const unknown = pages?.filter((page) => !PREVIEW_PAGES.includes(page)) ?? []
  if (unknown.length)
    throw new ToolError(
      `Unknown page: ${unknown.join(", ")}. Pages: ${PREVIEW_PAGES.join(", ")}`,
    )
  const encoded = canonicalPreset(preset)
  return {
    studio: withQuery(`${origin}/studio`, { preset: encoded }),
    url: previewUrl(origin, encoded, "{page}", "{light|dark}"),
    pages: pages?.length ? pages : PREVIEW_PAGES,
    note: "Fill {page} from pages and pick one mode. Pages render client-side: open them in a browser (a plain HTTP fetch returns an empty shell). Without a browser, call render for screenshots of the same pages. Only if render fails too, verify with check and tell the user you have not seen the result.",
  }
}

/* --------------------------------- export -------------------------------- */

export function exportDesign(registryOrigin: string, preset?: string) {
  const encoded = canonicalPreset(preset)
  const query = encoded ? `?preset=${encoded}` : ""
  const initUrl = `${registryOrigin}/r/init${query}`
  return {
    shadcn: {
      init: buildInitCommands(initUrl),
      add: buildInstallCommands(["button"]),
      note: "Run init in the project root (add `--template next|start|vite|react-router` to scaffold a new app). It writes the theme and registers @dotui with this preset, so later `shadcn add @dotui/<name>` installs components in this design system.",
    },
    v0: `https://v0.dev/chat/api/open?url=${encodeURIComponent(`${registryOrigin}/r/v0${query}`)}`,
    studio: `${registryOrigin}/studio${query}`,
  }
}
