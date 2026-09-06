/* Breadcrumbs — the trail's two forks: the separator glyph (slash: Carbon,
   Primer, Vercel · chevron: Spectrum, shadcn, Fluent) and the ancestor tone
   (muted labels that sharpen on hover · accent links). The current crumb is
   plain foreground in both camps.

   Engine: `separator` and `tone` are enum params on `breadcrumbs`. */

import type { Resolved, StudioState } from "./index"

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

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveBreadcrumbs(state: StudioState): Resolved {
  return {
    params: {
      breadcrumbs: {
        separator: pick(
          SEPARATOR_OPTIONS,
          state.breadcrumbSeparator,
          BREADCRUMB_DEFAULTS.breadcrumbSeparator,
        ),
        tone: pick(
          TONE_OPTIONS,
          state.breadcrumbTone,
          BREADCRUMB_DEFAULTS.breadcrumbTone,
        ),
      },
    },
  }
}
