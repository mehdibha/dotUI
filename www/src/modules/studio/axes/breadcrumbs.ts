/* Breadcrumbs — the trail's two forks: the separator glyph (slash: Carbon,
   Primer, Vercel · chevron: Spectrum, shadcn, Fluent) and the ancestor tone
   (muted labels that sharpen on hover · accent links). The current crumb is
   plain foreground in both camps.

   Engine: `separator` and `tone` are enum params on `breadcrumbs`; the link's
   hover color eases on the `--studio-breadcrumbs-state-*` vars. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's breadcrumb link: `transition-colors` on Tailwind's default. */
const MOTION = TAILWIND_TIMING

export const BREADCRUMB_DEFAULTS = {
  breadcrumbSeparator: "chevron",
  breadcrumbTone: "muted",
  breadcrumbsMotion: MOTION,
}

export const SEPARATOR_OPTIONS = [
  { value: "slash", label: "Slash" },
  { value: "chevron", label: "Chevron" },
]

export const TONE_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "muted", label: "Muted" },
]

export const BREADCRUMB_SCHEMA: ChapterSchema<typeof BREADCRUMB_DEFAULTS> = {
  breadcrumbSeparator: oneOf(SEPARATOR_OPTIONS),
  breadcrumbTone: oneOf(TONE_OPTIONS),
  breadcrumbsMotion: STATE_CHANGE,
}

export function resolveBreadcrumbs(state: Effective): Resolved {
  return {
    tokens: resolveStateChange("breadcrumbs", state.breadcrumbsMotion, MOTION),
    params: {
      breadcrumbs: {
        separator: state.breadcrumbSeparator,
        tone: state.breadcrumbTone,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "breadcrumbs",
  defaults: BREADCRUMB_DEFAULTS,
  schema: BREADCRUMB_SCHEMA,
  resolve: resolveBreadcrumbs,
})
