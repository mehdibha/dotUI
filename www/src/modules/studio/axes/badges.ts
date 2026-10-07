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

export const STYLE_VALUES = [
  "solid",
  "soft",
  "outline",
  "soft-outline",
  "dot",
] as const

export const SHAPE_VALUES = ["pill", "rounded"] as const

export const CASE_VALUES = ["sentence", "uppercase"] as const

export const BADGE_SCHEMA: ChapterSchema<typeof BADGE_DEFAULTS> = {
  badgeStyle: oneOf(STYLE_VALUES),
  badgeShape: oneOf(SHAPE_VALUES),
  badgeCase: oneOf(CASE_VALUES),
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
