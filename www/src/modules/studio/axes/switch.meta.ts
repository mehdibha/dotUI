import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { STYLE_VALUES } from "./switch"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  inset: { label: "Inset" },
  outlined: { label: "Outlined" },
  slab: { label: "Slab" },
})

export const OPTIONS = {
  switchColor: SOURCE_OPTIONS,
  switchStyle: STYLE_OPTIONS,
}
