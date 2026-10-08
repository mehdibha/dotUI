import { options } from "./core/meta"
import { LIBRARY_VALUES, WEIGHT_VALUES } from "./icons"

export const LIBRARY_OPTIONS = options(LIBRARY_VALUES, {
  lucide: { label: "Lucide", credits: ["shadcn", "Supabase"] },
  phosphor: { label: "Phosphor", credits: ["shadcn create"] },
  tabler: { label: "Tabler", credits: ["shadcn create"] },
  remix: { label: "Remix", credits: ["shadcn create"] },
  hugeicons: { label: "Hugeicons", credits: ["shadcn create", "shadcn mira"] },
  "material-symbols": { label: "Material Symbols", credits: ["Material 3"] },
  octicons: { label: "Octicons", credits: ["Primer"] },
})

export const WEIGHT_OPTIONS = options(WEIGHT_VALUES, {
  thin: { label: "Thin" },
  light: { label: "Light" },
  regular: { label: "Regular" },
  bold: { label: "Bold" },
  fill: { label: "Fill" },
  duotone: { label: "Duotone" },
})

export const OPTIONS = {
  iconLibrary: LIBRARY_OPTIONS,
  iconWeight: WEIGHT_OPTIONS,
}
