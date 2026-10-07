import { SEPARATOR_VALUES } from "./button-groups"
import { options } from "./core/meta"

const SEPARATORS = options(SEPARATOR_VALUES, {
  "shared-edge": {
    label: "Shared edge",
    description: "Primer, Polaris, Untitled UI",
  },
  divider: { label: "Divider", description: "Carbon, Supabase" },
})

export const SEPARATOR_OPTIONS = [
  { value: "auto", label: "Auto", description: "Spectrum 2" },
  ...SEPARATORS,
]

export const OPTIONS = { groupSeparator: SEPARATORS }
