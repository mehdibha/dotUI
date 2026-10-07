import { ANCESTOR_VALUES, SEPARATOR_VALUES } from "./breadcrumbs"
import { options } from "./core/meta"

export const SEPARATOR_OPTIONS = options(SEPARATOR_VALUES, {
  chevron: {
    label: "Chevron",
    description: "shadcn, Geist, Spectrum 2, Fluent 2",
  },
  slash: { label: "Slash", description: "Primer, Carbon, Atlassian, Notion" },
})

export const ANCESTOR_OPTIONS = options(ANCESTOR_VALUES, {
  muted: { label: "Muted", description: "shadcn, Geist, Spectrum 2" },
  link: { label: "Same as links", description: "Primer, Carbon, Stripe" },
})

export const OPTIONS = {
  breadcrumbSeparator: SEPARATOR_OPTIONS,
  breadcrumbTone: ANCESTOR_OPTIONS,
}
