import { SEPARATOR_VALUES } from "./button-groups"
import { options } from "./core/meta"

const SEPARATORS = options(SEPARATOR_VALUES, {
  "shared-edge": {
    label: "Shared edge",
    description: "Neighbors share one border",
    credits: ["Primer", "Polaris", "Untitled UI"],
  },
  divider: {
    label: "Divider",
    description: "A short line between borderless segments",
    credits: ["Carbon", "Supabase"],
  },
})

export const SEPARATOR_OPTIONS = [
  {
    value: "auto",
    label: "Auto",
    description: "Shared edge on outlined buttons, else divider",
    credits: ["Spectrum 2"],
  },
  ...SEPARATORS,
]

export const OPTIONS = { groupSeparator: SEPARATORS }
