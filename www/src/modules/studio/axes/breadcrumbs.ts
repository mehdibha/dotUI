/* Breadcrumbs — the trail's two forks: the separator glyph (slash: Carbon,
   Primer, Vercel · chevron: Spectrum, shadcn, Fluent) and the ancestor tone
   (muted labels that sharpen on hover · accent links). The current crumb is
   plain foreground in both camps.

   Engine: `separator` and `tone` are enum params on `breadcrumbs`. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const BREADCRUMB_DEFAULTS = {
  breadcrumbSeparator: "chevron",
  breadcrumbTone: "muted",
}

export const SEPARATOR_OPTIONS = [
  { value: "slash", label: "Slash" },
  { value: "chevron", label: "Chevron" },
]

export const TONE_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "muted", label: "Muted" },
]

export const BREADCRUMB_SCHEMA: Schema<typeof BREADCRUMB_DEFAULTS> = {
  breadcrumbSeparator: oneOf(SEPARATOR_OPTIONS),
  breadcrumbTone: oneOf(TONE_OPTIONS),
}

export function resolveBreadcrumbs(state: StudioState): Resolved {
  return {
    params: {
      breadcrumbs: {
        separator: state.breadcrumbSeparator,
        tone: state.breadcrumbTone,
      },
    },
  }
}
