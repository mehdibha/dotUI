/* Spinner: the indeterminate loading signature, each style with its own
   loop. Button, list-box, table and toast embed it.

   Engine: a files-based enum param on `loader` (one base file per style). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SPINNER_DEFAULTS = {
  spinnerStyle: "ring",
}

export const STYLE_OPTIONS = [
  {
    value: "ring",
    label: "Ring",
    description: "shadcn, Polaris, HeroUI, Chakra, Material 3",
  },
  {
    value: "ring-track",
    label: "Ring + track",
    description: "Primer, Spectrum 2, Fluent 2, Mantine",
  },
  {
    value: "blades",
    label: "Blades",
    description: "Radix Themes, Geist, Apple",
  },
  { value: "dots", label: "Dots", description: "Ant Design" },
]

export const SPINNER_SCHEMA: ChapterSchema<typeof SPINNER_DEFAULTS> = {
  spinnerStyle: oneOf(STYLE_OPTIONS),
}

export function resolveSpinner(state: Effective): Resolved {
  return { params: { loader: { style: state.spinnerStyle } } }
}

export const chapter = defineChapter({
  id: "spinner",
  defaults: SPINNER_DEFAULTS,
  schema: SPINNER_SCHEMA,
  resolve: resolveSpinner,
})
