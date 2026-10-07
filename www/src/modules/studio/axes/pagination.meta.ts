import { options } from "./core/meta"
import { CURRENT_VALUES } from "./pagination"

export const CURRENT_OPTIONS = options(CURRENT_VALUES, {
  secondary: { label: "Secondary", description: "shadcn, Ant" },
  primary: { label: "Primary", description: "Primer, GOV.UK" },
  selected: { label: "Selected", description: "Untitled UI, Atlassian" },
})

export const OPTIONS = {
  paginationCurrent: CURRENT_OPTIONS,
}
