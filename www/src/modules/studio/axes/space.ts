/* Density — which of the registry's hand-tuned tiers every component wears
   (heights, insets, gaps, and the text size that rides with them). The
   spacing unit stays Tailwind's 4px.

   `density` selects the tier layer `useStyles` composes live and the
   publisher flattens into the shipped classes. */

import { DENSITIES } from "@/registry/types"
import type { Density } from "@/registry/types"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const chapter = defineChapter({
  id: "space",
  defaults: {
    density: "default",
  },
  schema: {
    density: oneOf(DENSITIES),
  },
  resolve(state: Effective): Resolved {
    return { density: state.density as Density }
  },
})
