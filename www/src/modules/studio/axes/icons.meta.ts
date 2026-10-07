import { options } from "./core/meta"
import { LIBRARY_VALUES, WEIGHT_VALUES } from "./icons"

export const LIBRARY_OPTIONS = options(LIBRARY_VALUES, {
  lucide: { label: "Lucide" },
  phosphor: { label: "Phosphor" },
  tabler: { label: "Tabler" },
  remix: { label: "Remix" },
  hugeicons: { label: "Hugeicons" },
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
