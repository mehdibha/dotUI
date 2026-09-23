/* The built-in presets. Each one is a list of immutable revisions — a full
   studio state plus the codec version it was authored in, lifted through the
   migrations on load. Changing a preset's look ships a new revision; the
   published ones are pinned by hash in catalog.test.ts. Pages that must not
   load the resolver (the landing) read the precomputed
   __generated__/catalog.ts instead. */

import { DEFAULTS, validateState } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import { migrate, VERSION } from "@/modules/studio/preset/migrations"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import airbnb from "./revisions/airbnb.json"
import claude from "./revisions/claude.json"
import github from "./revisions/github.json"
import linear from "./revisions/linear.json"
import notion from "./revisions/notion.json"
import origin from "./revisions/origin.json"
import spotify from "./revisions/spotify.json"
import stripe from "./revisions/stripe.json"
import supabase from "./revisions/supabase.json"
import vercel from "./revisions/vercel.json"

export interface PresetRevision {
  rev: number
  /** The codec version the state was authored in. */
  version: number
  state: Record<string, unknown>
}

export interface PresetMeta {
  id: string
  name: string
  description: string
  /** Curated accent for dots and chips, legible on light and dark surfaces. */
  swatch: string
  /** The brand a preset recreates; absent for dotUI's own. */
  inspiredBy?: string
}

/** A preset's latest revision, precomputed for the pages that show it. */
export interface PresetSummary extends PresetMeta {
  rev: number
  designSystem: DesignSystem
}

export interface Preset extends PresetSummary {
  state: StudioState
}

const CATALOG: Array<PresetMeta & { revisions: PresetRevision[] }> = [
  {
    id: "origin",
    name: "Origin",
    description: "dotUI blue, the starting point.",
    swatch: "#0072f5",
    revisions: origin,
  },
  {
    id: "claude",
    name: "Claude",
    description: "Warm coral on sand.",
    swatch: "#e0916f",
    inspiredBy: "Claude",
    revisions: claude,
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Emerald on cool gray.",
    swatch: "#3ecf8e",
    inspiredBy: "Supabase",
    revisions: supabase,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Blurple on cool slate.",
    swatch: "#7a73ff",
    inspiredBy: "Stripe",
    revisions: stripe,
  },
  {
    id: "linear",
    name: "Linear",
    description: "Indigo, crisp hairlines.",
    swatch: "#818cf8",
    inspiredBy: "Linear",
    revisions: linear,
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Monochrome, hairline borders.",
    swatch: "#cbd5e1",
    inspiredBy: "Vercel",
    revisions: vercel,
  },
  {
    id: "airbnb",
    name: "Airbnb",
    description: "Rausch accents, ink actions.",
    swatch: "#ff5c7c",
    inspiredBy: "Airbnb",
    revisions: airbnb,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Primer blue, sober gray.",
    swatch: "#54aeff",
    inspiredBy: "GitHub",
    revisions: github,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Warm ink, quiet blue.",
    swatch: "#d4cec2",
    inspiredBy: "Notion",
    revisions: notion,
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Vivid green, pill-shaped.",
    swatch: "#1ed760",
    inspiredBy: "Spotify",
    revisions: spotify,
  },
]

/** A revision's state lifted to the current version; a key added since
 *  takes its default. */
export function loadRevision(revision: PresetRevision): {
  state: StudioState
  dropped: string[]
} {
  if (revision.version > VERSION)
    throw new Error(`preset revision from codec v${revision.version}`)
  const dropped: string[] = []
  const lifted = migrate(revision.state, revision.version, dropped)
  const valid = validateState(lifted, DEFAULTS)
  return { state: valid.state, dropped: [...dropped, ...valid.dropped] }
}

/** Every published revision, oldest first. */
export const REVISIONS: Record<string, PresetRevision[]> = Object.fromEntries(
  CATALOG.map(({ id, revisions }) => [id, revisions]),
)

export const PRESETS: Preset[] = CATALOG.map(({ revisions, ...meta }) => {
  const latest = revisions.at(-1) as PresetRevision
  const { state } = loadRevision(latest)
  return {
    ...meta,
    rev: latest.rev,
    state,
    designSystem: resolveDesignSystem(state),
  }
})

/** The default preset — what /studio starts on for first-time users. */
export const ORIGIN = PRESETS[0] as Preset
