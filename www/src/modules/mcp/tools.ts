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
import { checkAxisValue } from "@/modules/studio/axes/spec"
import type { AxisSpec } from "@/modules/studio/axes/spec"
import {
  decodePreset,
  diffState,
  encodePreset,
} from "@/modules/studio/preset/codec"
import type { StudioPreset } from "@/modules/studio/preset/codec"
import { AVAILABLE_BLOCKS } from "@/modules/studio/preview/blocks"
import { resolveDesignSystem } from "@/modules/studio/resolve"

export class ToolError extends Error {}

const AXES = new Map(
  CATALOG.flatMap((chapter) =>
    Object.entries(chapter.axes).map(
      ([key, spec]) => [key, { chapter: chapter.id, spec }] as const,
    ),
  ),
)

const decode = (preset: string | undefined): StudioPreset =>
  preset ? decodePreset(preset) : { state: DEFAULTS }

const encode = (preset: StudioPreset) => encodePreset(preset) ?? ""

/* --------------------------------- links --------------------------------- */

export const PREVIEW_PAGES = [
  "overview",
  ...AVAILABLE_BLOCKS.map((block) => block.slug),
]

function links(origin: string, preset: string) {
  const query = preset ? `?preset=${preset}` : ""
  return {
    studio: `${origin}/studio${query}`,
    preview: `${origin}/preview/overview${query}`,
  }
}

/* ------------------------------- list_axes ------------------------------- */

const axisEntry = (key: string, spec: AxisSpec) => ({
  key,
  ...spec,
  default: DEFAULTS[key as keyof StudioState],
})

export function listAxes(chapters?: string[]) {
  if (!chapters?.length)
    return {
      chapters: CATALOG.map((chapter) => ({
        id: chapter.id,
        label: chapter.label,
        description: chapter.description,
        axes: Object.entries(chapter.axes).map(([key, spec]) => ({
          key,
          label: spec.label,
        })),
      })),
    }
  const unknown = chapters.filter(
    (id) => !CATALOG.some((chapter) => chapter.id === id),
  )
  if (unknown.length)
    throw new ToolError(
      `Unknown chapter: ${unknown.join(", ")}. Chapters: ${CATALOG.map((c) => c.id).join(", ")}`,
    )
  return {
    chapters: CATALOG.filter((chapter) => chapters.includes(chapter.id)).map(
      (chapter) => ({
        id: chapter.id,
        label: chapter.label,
        description: chapter.description,
        axes: Object.entries(chapter.axes).map(([key, spec]) =>
          axisEntry(key, spec),
        ),
        ...(chapter.recipes ? { recipes: chapter.recipes } : {}),
      }),
    ),
  }
}

/* ------------------------------- get_design ------------------------------ */

/** The axes off their defaults, by chapter. */
function changedByChapter(state: StudioState) {
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
    changed: changedByChapter(decoded.state),
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

/** What moved in the resolved system: the tokens, params and engine inputs. */
function effects(before: StudioState, after: StudioState) {
  const a = resolveDesignSystem(before)
  const b = resolveDesignSystem(after)
  const tokens: Record<string, { from?: string; to?: string }> = {}
  for (const name of new Set([
    ...Object.keys(a.tokens),
    ...Object.keys(b.tokens),
  ]))
    if (a.tokens[name] !== b.tokens[name])
      tokens[name] = { from: a.tokens[name], to: b.tokens[name] }
  const params: Record<
    string,
    Record<string, { from?: string; to?: string }>
  > = {}
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
  return {
    tokens,
    params,
    ...(a.density !== b.density ? { density: b.density } : {}),
    ...(a.icons !== b.icons ? { icons: b.icons ?? "lucide" } : {}),
    colorChanged: JSON.stringify(a.color) !== JSON.stringify(b.color),
  }
}

export function setAxes(
  origin: string,
  input: {
    preset?: string
    set?: Record<string, unknown>
    reset?: string[]
    codeOptions?: Partial<CodeOptions>
  },
) {
  const decoded = decode(input.preset)
  const errors: string[] = []
  const next: Record<string, unknown> = { ...decoded.state }

  for (const target of input.reset ?? []) {
    const chapter = CATALOG.find((c) => c.id === target)
    const keys =
      target === "all"
        ? Object.keys(DEFAULTS)
        : chapter
          ? Object.keys(chapter.axes)
          : AXES.has(target)
            ? [target]
            : undefined
    if (!keys) {
      errors.push(`reset: unknown axis or chapter "${target}"`)
      continue
    }
    for (const key of keys) next[key] = DEFAULTS[key as keyof StudioState]
  }

  for (const [key, value] of Object.entries(input.set ?? {})) {
    const axis = AXES.get(key)
    if (!axis) {
      const near = closest(key)
      errors.push(
        `${key}: unknown axis${near.length ? ` (did you mean ${near.join(", ")}?)` : ""}`,
      )
      continue
    }
    const problem = checkAxisValue(axis.spec, value)
    if (problem) errors.push(`${key}: ${problem}, got ${JSON.stringify(value)}`)
    else next[key] = value
  }

  if (errors.length) throw new ToolError(errors.join("\n"))

  const state = next as StudioState
  const codeOptions = input.codeOptions
    ? sanitizeCodeOptions({
        ...(decoded.codeOptions ?? DEFAULT_CODE_OPTIONS),
        ...input.codeOptions,
      })
    : decoded.codeOptions
  const encoded = encode({ state, codeOptions })
  return {
    preset: encoded,
    effects: effects(decoded.state, state),
    changed: changedByChapter(state),
    links: links(origin, encoded),
  }
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

export function listFonts(category?: FontCategory, query?: string) {
  const needle = query?.toLowerCase()
  return {
    fonts: FONT_CATALOG.filter(
      (font) =>
        (!category || font.category === category) &&
        (!needle || font.family.toLowerCase().includes(needle)),
    ).map((font) => ({ family: font.family, category: font.category })),
  }
}

/* ------------------------------ preview_urls ----------------------------- */

export function previewUrls(origin: string, preset?: string) {
  const encoded = encode(decode(preset))
  const query = encoded ? `?preset=${encoded}` : ""
  return {
    studio: `${origin}/studio${query}`,
    pages: PREVIEW_PAGES.map((page) => ({
      page,
      url: `${origin}/preview/${page}${query}`,
    })),
    note: "Preview pages render client-side: open them in a browser (a plain HTTP fetch returns an empty shell). Append &mode=dark for dark mode.",
  }
}

/* --------------------------------- export -------------------------------- */

export function exportDesign(registryOrigin: string, preset?: string) {
  const encoded = encode(decode(preset))
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
