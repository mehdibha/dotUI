/* The built-in presets' published data. Each one is a list of immutable
   revisions — a full studio state plus the codec version it was authored in,
   lifted through the migrations on load. Changing a preset's look ships a new
   revision; the published ones are pinned by hash in catalog.test.ts. Kept
   apart from the resolved catalog so the codec reads revisions without
   resolving every preset. */

import { DEFAULTS, validateState } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import { migrate, VERSION } from "@/modules/studio/preset/migrations"

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

export const BUILT_INS: Array<PresetMeta & { revisions: PresetRevision[] }> = [
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
    description: "Ink actions, clay highlights.",
    swatch: "#d97757",
    inspiredBy: "Claude",
    revisions: claude,
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Emerald on neutral graphite.",
    swatch: "#34b27b",
    inspiredBy: "Supabase",
    revisions: supabase,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Blurple fills, cool slate hairlines.",
    swatch: "#675dff",
    inspiredBy: "Stripe",
    revisions: stripe,
  },
  {
    id: "linear",
    name: "Linear",
    description: "Indigo on near-black, pill actions.",
    swatch: "#828fff",
    inspiredBy: "Linear",
    revisions: linear,
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Monochrome ink, Geist blue accents.",
    swatch: "#8f8f8f",
    inspiredBy: "Vercel",
    revisions: vercel,
  },
  {
    id: "airbnb",
    name: "Airbnb",
    description: "Rausch accents, ink actions.",
    swatch: "#ff385c",
    inspiredBy: "Airbnb",
    revisions: airbnb,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Green actions, blue selection.",
    swatch: "#1f883d",
    inspiredBy: "GitHub",
    revisions: github,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Warm ink, quiet blue.",
    swatch: "#8e8b86",
    inspiredBy: "Notion",
    revisions: notion,
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Vivid green on near-black.",
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
  BUILT_INS.map(({ id, revisions }) => [id, revisions]),
)
