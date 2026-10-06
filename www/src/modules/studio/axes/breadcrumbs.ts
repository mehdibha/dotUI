/* Breadcrumbs — the separator glyph and how ancestors read: muted labels
   that sharpen on hover, or links in the link recipe. The current crumb is
   plain foreground either way.

   Engine: `separator` and `ancestors` enum params on `breadcrumbs`;
   `ancestors` folds in the link color and underline. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const BREADCRUMB_DEFAULTS = {
  breadcrumbSeparator: "chevron",
  breadcrumbTone: "muted",
}

/* Descriptions credit the systems each option is copied from. */
export const SEPARATOR_OPTIONS = [
  {
    value: "chevron",
    label: "Chevron",
    description: "shadcn, Geist, Spectrum 2, Fluent 2",
  },
  {
    value: "slash",
    label: "Slash",
    description: "Primer, Carbon, Atlassian, Notion",
  },
]

export const ANCESTOR_OPTIONS = [
  { value: "muted", label: "Muted", description: "shadcn, Geist, Spectrum 2" },
  {
    value: "link",
    label: "Same as links",
    description: "Primer, Carbon, Stripe",
  },
]

export const BREADCRUMB_SCHEMA: ChapterSchema<typeof BREADCRUMB_DEFAULTS> = {
  breadcrumbSeparator: oneOf(SEPARATOR_OPTIONS),
  breadcrumbTone: oneOf(ANCESTOR_OPTIONS),
}

export function resolveBreadcrumbs(state: Effective): Resolved {
  return {
    params: {
      breadcrumbs: {
        separator: state.breadcrumbSeparator,
        ancestors:
          state.breadcrumbTone === "link"
            ? `${state.linkColor}-${state.linkUnderline}`
            : "muted",
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
