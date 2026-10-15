import { ANCESTOR_VALUES, SEPARATOR_VALUES } from "./breadcrumbs"
import { options } from "./core/meta"

export const SEPARATOR_OPTIONS = options(SEPARATOR_VALUES, {
  chevron: {
    label: "Chevron",
    description: "A small right-pointing arrow",
    credits: ["shadcn", "Geist", "Spectrum 2", "Fluent 2"],
  },
  slash: {
    label: "Slash",
    description: "A forward slash, like a file path",
    credits: ["Primer", "Carbon", "Atlassian", "Notion"],
  },
})

export const ANCESTOR_OPTIONS = options(ANCESTOR_VALUES, {
  muted: {
    label: "Muted",
    description: "Gray crumbs that darken on hover",
    credits: ["shadcn", "Geist", "Spectrum 2"],
  },
  link: {
    label: "Same as links",
    description: "Follows the link color and underline",
    credits: ["Primer", "Carbon", "Stripe"],
  },
})

export const OPTIONS = {
  breadcrumbSeparator: SEPARATOR_OPTIONS,
  breadcrumbTone: ANCESTOR_OPTIONS,
}
