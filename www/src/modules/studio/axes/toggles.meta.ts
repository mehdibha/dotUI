import { options } from "./core/meta"
import { SELECTED_VALUES } from "./toggles"

export const SELECTED_OPTIONS = options(SELECTED_VALUES, {
  tone: {
    label: "Tone",
    description: "Steps one neutral shade darker when on",
    credits: ["shadcn", "Polaris", "Untitled UI"],
  },
  solid: {
    label: "Solid",
    description: "Fills with the selection color when on",
    credits: ["Material 3", "Spectrum 2"],
  },
  tint: {
    label: "Tint",
    description: "Light selection-color wash when on",
    credits: ["Atlassian", "Ant", "Duolingo"],
  },
  inverse: {
    label: "Inverse",
    description: "Flips to full contrast when on",
    credits: ["Spectrum 2", "Spotify"],
  },
})

export const OPTIONS = {
  toggleSelected: SELECTED_OPTIONS,
}
