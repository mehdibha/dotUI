/* Skeleton: how placeholders idle while content loads. The loop's cycle is
   the recipe's own. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const ANIMATION_VALUES = ["shimmer", "pulse", "none"] as const

export const chapter = defineChapter({
  id: "skeleton",
  defaults: {
    skeletonAnimation: "shimmer",
  },
  schema: {
    skeletonAnimation: oneOf(ANIMATION_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: { skeleton: { animation: state.skeletonAnimation } },
    }
  },
})
