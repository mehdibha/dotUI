/* The interview's first card: up to three whole design systems side by side.
   Pure — the server validates directions and mints the pick; the card
   renders them. */

import { parseSnapshotInput } from "@/lib/snapshots/parse"
import { snapshotId, stored } from "@/lib/snapshots/snapshot"
import type { SnapshotStore } from "@/lib/snapshots/store"
import { getPreset, PRESET_META } from "@/modules/presets"
import {
  DEFAULTS,
  FOLLOWS,
  KEY_OWNER,
  SCHEMA,
  validate,
} from "@/modules/studio/axes"
import { OPTIONS } from "@/modules/studio/axes/meta"
import type { AxisSchema } from "@/modules/studio/axes/schema"

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

export interface DesignInput {
  /** A built-in preset id to start from. */
  preset?: string
  /** Axis values over the preset (or over the defaults). */
  axes?: Record<string, unknown>
}

export interface DirectionInput extends DesignInput {
  name: string
  summary: string
}

export interface Direction {
  name: string
  summary: string
  /** Keys that differ from the defaults: what the card resolves. */
  diff: Record<string, unknown>
}

type Result<T> = { ok: true; value: T } | { ok: false; problems: string[] }

/** The preset's diff with `axes` on top, validated. */
export function resolveDesign({
  preset,
  axes = {},
}: DesignInput): Result<Record<string, unknown>> {
  const base = preset ? getPreset(preset) : undefined
  if (preset && !base)
    return {
      ok: false,
      problems: [
        `preset: unknown "${preset}", expected one of ${PRESET_META.map((p) => p.id).join(", ")}`,
      ],
    }
  const diff = { ...base?.diff, ...axes }
  const result = validate(diff)
  if (!result.ok)
    return {
      ok: false,
      problems: result.issues.map(
        ({ key, problem }) => `${key || "axes"}: ${problem}`,
      ),
    }
  return { ok: true, value: diff }
}

/** Every direction validated; problems are prefixed with the direction. */
export function resolveDirections(
  inputs: DirectionInput[],
): Result<Direction[]> {
  const directions: Direction[] = []
  const problems: string[] = []
  for (const { name, summary, ...design } of inputs) {
    const result = resolveDesign(design)
    if (result.ok) directions.push({ name, summary, diff: result.value })
    else problems.push(...result.problems.map((p) => `${name} → ${p}`))
  }
  return problems.length > 0
    ? { ok: false, problems }
    : { ok: true, value: directions }
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
      return "a Google Fonts family name"
  }
}

/** What the model composes directions from: the presets and the identity
 *  axes, with their values and what each value means. */
export function identityCatalog() {
  return {
    presets: PRESET_META.map(({ id, name, description, inspiredBy }) => ({
      id,
      name,
      description,
      ...(inspiredBy ? { inspiredBy } : {}),
    })),
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
  studioUrl: string
  initUrl: string
  installCommand: string
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
    return {
      ok: false,
      problems: parsed.issues.map(({ key, problem }) => `${key}: ${problem}`),
    }
  const id = await snapshotId(parsed.value)
  await store.put(id, JSON.stringify(stored(parsed.value)))
  const initUrl = `${origin}/r/s/${id}/init.json`
  return {
    ok: true,
    value: {
      id,
      name: parsed.value.name,
      studioUrl: `${origin}/studio?s=${id}`,
      initUrl,
      installCommand: `npx shadcn@latest init ${initUrl}`,
    },
  }
}
