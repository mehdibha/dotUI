import { options } from "./core/meta"
import { LIBRARY_VALUES, WEIGHT_VALUES } from "./icons"

export const LIBRARY_OPTIONS = options(LIBRARY_VALUES, {
  lucide: {
    label: "Lucide",
    description: "Clean, even 2px line icons",
    credits: ["shadcn", "Supabase"],
  },
  phosphor: {
    label: "Phosphor",
    description: "Friendly icons in six weights",
    credits: ["shadcn create"],
  },
  tabler: {
    label: "Tabler",
    description: "A large set of 2px line icons",
    credits: ["shadcn create"],
  },
  remix: {
    label: "Remix",
    description: "Balanced, neutral line icons",
    credits: ["shadcn create"],
  },
  hugeicons: {
    label: "Hugeicons",
    description: "Soft, rounded 1.5px line icons",
    credits: ["shadcn create", "shadcn mira"],
  },
  "material-symbols": {
    label: "Material Symbols",
    description: "Geometric icons with crisp corners",
    credits: ["Material 3"],
  },
  octicons: {
    label: "Octicons",
    description: "Compact 1.5px icons tuned for small sizes",
    credits: ["Primer"],
  },
})

export const WEIGHT_OPTIONS = options(WEIGHT_VALUES, {
  thin: { label: "Thin", description: "Hairline strokes" },
  light: { label: "Light", description: "Fine strokes" },
  regular: { label: "Regular", description: "Standard strokes" },
  bold: { label: "Bold", description: "Heavy strokes" },
  fill: { label: "Fill", description: "Solid filled shapes" },
  duotone: { label: "Duotone", description: "Outlines over a faded fill" },
})

export const OPTIONS = {
  iconLibrary: LIBRARY_OPTIONS,
  iconWeight: WEIGHT_OPTIONS,
}
