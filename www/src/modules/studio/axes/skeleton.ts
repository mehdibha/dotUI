/* Skeleton — how skeletons idle while content loads. Animation is the one
   place a design system runs continuous ambient motion — shimmer
   (Carbon/Ant) vs pulse (shadcn/MUI) vs none (Linear-style stillness). The
   loop's cycle is the recipe's own.

   Engine: `animation` is an enum param on `skeleton`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SKELETON_DEFAULTS = {
  skeletonAnimation: "shimmer",
}

export const ANIMATION_OPTIONS = [
  { value: "shimmer", label: "Shimmer" },
  { value: "pulse", label: "Pulse" },
  { value: "none", label: "None" },
]

export const SKELETON_SCHEMA: ChapterSchema<typeof SKELETON_DEFAULTS> = {
  skeletonAnimation: oneOf(ANIMATION_OPTIONS),
}

export function resolveSkeleton(state: Effective): Resolved {
  return {
    params: { skeleton: { animation: state.skeletonAnimation } },
  }
}

export const chapter = defineChapter({
  id: "skeleton",
  defaults: SKELETON_DEFAULTS,
  schema: SKELETON_SCHEMA,
  resolve: resolveSkeleton,
})
