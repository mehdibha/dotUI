/* Breadcrumbs — the trail's two forks: the separator glyph (slash: Carbon,
   Primer, Vercel · chevron: Spectrum, shadcn, Fluent) and the ancestor tone
   (muted labels that sharpen on hover · accent links). The current crumb is
   plain foreground in both camps.

   Engine: `separator` and `tone` are enum params on `breadcrumbs`. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const BREADCRUMB_DEFAULTS = {
  breadcrumbSeparator: "chevron",
  breadcrumbTone: "muted",
}

export const SEPARATOR_OPTIONS = [
  {
    value: "slash",
    label: "Slash",
    description: "A plain “/” character between crumbs.",
    seenIn: ["Carbon", "Ant Design"],
  },
  {
    value: "chevron",
    label: "Chevron",
    description:
      "A 16px right-chevron icon from the icon library between crumbs.",
    seenIn: ["shadcn/ui", "Spectrum 2"],
  },
]

export const TONE_OPTIONS = [
  {
    value: "accent",
    label: "Accent",
    description:
      "Ancestor crumbs are accent-colored links that underline on hover.",
    seenIn: ["Carbon"],
  },
  {
    value: "muted",
    label: "Muted",
    description:
      "Ancestor crumbs are muted text that sharpens to the text color on " +
      "hover.",
    seenIn: ["shadcn/ui", "Spectrum 2", "Ant Design"],
  },
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

export const BREADCRUMB_SPEC = {
  label: "Breadcrumbs",
  description:
    "The breadcrumb trail's separator glyph and how loud its ancestor links " +
    "are. The current crumb is always plain text in the text color.",
  axes: {
    breadcrumbSeparator: {
      label: "Separator",
      description: "The glyph drawn between crumbs.",
      value: { type: "enum", options: SEPARATOR_OPTIONS },
      guidance:
        "An even split: Carbon and Ant use a slash, shadcn and Spectrum 2 a " +
        "chevron. Slash reads like a file path and suits developer tools; " +
        "the chevron reads as hierarchy and follows the icon library's " +
        "stroke.",
    },
    breadcrumbTone: {
      label: "Crumbs",
      description:
        "How the ancestor crumbs (every crumb but the current) read.",
      value: { type: "enum", options: TONE_OPTIONS },
      guidance:
        "3 of 4 systems checked (shadcn, Spectrum 2, Ant) mute the " +
        "ancestors so the trail recedes; Carbon paints them as regular " +
        "accent links. Accent suits link-dense, content-first sites.",
    },
  },
} satisfies ChapterSpec<typeof BREADCRUMB_DEFAULTS>
