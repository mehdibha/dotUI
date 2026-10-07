/* Badges and tags: one chips recipe (registry badge/styles.ts). Style is how
   much status color a chip carries and paints both; shape and case are the
   badge's alone, tags keep their control-sm corners and sentence case. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const BADGE_DEFAULTS = {
  badgeStyle: "solid",
  badgeShape: "pill",
  badgeCase: "sentence",
}

export const STYLE_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    description: "shadcn, Geist, Spectrum 2, Mantine, Fluent 2",
  },
  {
    value: "soft",
    label: "Soft",
    description: "Radix Themes, Polaris, Chakra, Carbon, Atlassian, HeroUI",
  },
  { value: "outline", label: "Outline", description: "Primer" },
  {
    value: "soft-outline",
    label: "Soft + outline",
    description: "Ant Design, Untitled UI, Supabase",
  },
]

export const SHAPE_OPTIONS = [
  {
    value: "pill",
    label: "Pill",
    description: "Geist, Primer, Carbon, Mantine, Supabase, Fluent 2, HeroUI",
  },
  {
    value: "rounded",
    label: "Rounded",
    description:
      "Atlassian, Ant Design, Chakra, Spectrum 2, Radix Themes, Untitled UI, Polaris (approx.)",
  },
]

export const CASE_OPTIONS = [
  {
    value: "sentence",
    label: "Sentence",
    description: "shadcn, Radix Themes, Primer, Polaris, Geist",
  },
  {
    value: "uppercase",
    label: "Uppercase",
    description: "Supabase, Mantine, Atlassian (v15), Chakra v2",
  },
]

export const BADGE_SCHEMA: ChapterSchema<typeof BADGE_DEFAULTS> = {
  badgeStyle: oneOf(STYLE_OPTIONS),
  badgeShape: oneOf(SHAPE_OPTIONS),
  badgeCase: oneOf(CASE_OPTIONS),
}

export function resolveBadges(state: Effective): Resolved {
  const style = state.badgeStyle
  return {
    // Rounded reads the detail rung: square under a square character.
    tokens:
      state.badgeShape === "rounded"
        ? { "--studio-badge-radius": "var(--studio-radius-detail)" }
        : {},
    params: {
      badge: { style, case: state.badgeCase },
      "tag-group": { style },
    },
  }
}

export const chapter = defineChapter({
  id: "badges",
  defaults: BADGE_DEFAULTS,
  schema: BADGE_SCHEMA,
  resolve: resolveBadges,
})
