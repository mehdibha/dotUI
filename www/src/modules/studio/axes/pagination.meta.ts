import { options } from "./core/meta"
import { CURRENT_VALUES } from "./pagination"

export const CURRENT_OPTIONS = options(CURRENT_VALUES, {
  secondary: {
    label: "Secondary",
    description: "Current page as a secondary button",
    credits: ["shadcn", "Ant"],
  },
  primary: {
    label: "Primary",
    description: "Current page as a solid primary button",
    credits: ["Primer", "GOV.UK"],
  },
  selected: {
    label: "Selected",
    description: "Current page in the toggles' selected look",
    credits: ["Untitled UI", "Atlassian"],
  },
})

export const OPTIONS = {
  paginationCurrent: CURRENT_OPTIONS,
}
