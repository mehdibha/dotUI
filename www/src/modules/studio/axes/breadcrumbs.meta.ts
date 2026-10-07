import { ANCESTOR_VALUES, SEPARATOR_VALUES } from "./breadcrumbs"
import { options } from "./core/meta"

export const SEPARATOR_OPTIONS = options(SEPARATOR_VALUES, {
  chevron: {
    label: "Chevron",
    credits: ["shadcn", "Geist", "Spectrum 2", "Fluent 2"],
  },
  slash: {
    label: "Slash",
    credits: ["Primer", "Carbon", "Atlassian", "Notion"],
  },
})

export const ANCESTOR_OPTIONS = options(ANCESTOR_VALUES, {
  muted: { label: "Muted", credits: ["shadcn", "Geist", "Spectrum 2"] },
  link: { label: "Same as links", credits: ["Primer", "Carbon", "Stripe"] },
})

export const OPTIONS = {
  breadcrumbSeparator: SEPARATOR_OPTIONS,
  breadcrumbTone: ANCESTOR_OPTIONS,
}
