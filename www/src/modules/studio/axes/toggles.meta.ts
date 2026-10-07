import { options } from "./core/meta"
import { SELECTED_VALUES } from "./toggles"

export const SELECTED_OPTIONS = options(SELECTED_VALUES, {
  tone: { label: "Tone", description: "shadcn, Polaris, Untitled UI" },
  solid: { label: "Solid", description: "Material 3, Spectrum 2" },
  tint: { label: "Tint", description: "Atlassian, Ant, Duolingo" },
  inverse: { label: "Inverse", description: "Spectrum 2, Spotify" },
})

export const OPTIONS = {
  toggleSelected: SELECTED_OPTIONS,
}
