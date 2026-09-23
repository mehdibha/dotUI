/* Skeleton — how skeletons idle while content loads. Animation is the one
   place a design system runs continuous ambient motion — shimmer
   (Carbon/Ant) vs pulse (shadcn/MUI) vs none (Linear-style stillness).

   Engine: `animation` is an enum param on `skeleton`. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const SKELETON_DEFAULTS = {
  skeletonAnimation: "shimmer",
}

export const ANIMATION_OPTIONS = [
  { value: "shimmer", label: "Shimmer" },
  { value: "pulse", label: "Pulse" },
  { value: "none", label: "None" },
]

export const SKELETON_SCHEMA: Schema<typeof SKELETON_DEFAULTS> = {
  skeletonAnimation: oneOf(ANIMATION_OPTIONS),
}

export function resolveSkeleton(state: StudioState): Resolved {
  return { params: { skeleton: { animation: state.skeletonAnimation } } }
}
