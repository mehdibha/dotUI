import { options } from "./core/meta"
import { SELECTED_VALUES } from "./toggles"

export const SELECTED_OPTIONS = options(SELECTED_VALUES, {
  tone: { label: "Tone", credits: ["shadcn", "Polaris", "Untitled UI"] },
  solid: { label: "Solid", credits: ["Material 3", "Spectrum 2"] },
  tint: { label: "Tint", credits: ["Atlassian", "Ant", "Duolingo"] },
  inverse: { label: "Inverse", credits: ["Spectrum 2", "Spotify"] },
})

export const OPTIONS = {
  toggleSelected: SELECTED_OPTIONS,
}
