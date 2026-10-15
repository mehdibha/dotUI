import { options } from "./core/meta"
import { CURRENT_VALUES } from "./pagination"

export const CURRENT_OPTIONS = options(CURRENT_VALUES, {
  secondary: { label: "Secondary", credits: ["shadcn", "Ant"] },
  primary: { label: "Primary", credits: ["Primer", "GOV.UK"] },
  selected: { label: "Selected", credits: ["Untitled UI", "Atlassian"] },
})

export const OPTIONS = {
  paginationCurrent: CURRENT_OPTIONS,
}
