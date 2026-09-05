/* Skeleton — how skeletons idle while content loads. Animation is the one
   place a design system runs continuous ambient motion — shimmer
   (Carbon/Ant) vs pulse (shadcn/MUI) vs none (Linear-style stillness).

   Engine: `animation` is an enum param on `skeleton`. */

import type { Resolved, StudioState } from "./index"

export const SKELETON_DEFAULTS = {
  skeletonAnimation: "shimmer",
}

export const ANIMATION_OPTIONS = [
  { value: "shimmer", label: "Shimmer" },
  { value: "pulse", label: "Pulse" },
  { value: "none", label: "None" },
]

export const WIRED = true

export function resolveSkeleton(state: StudioState): Resolved {
  const animation = ANIMATION_OPTIONS.some(
    (o) => o.value === state.skeletonAnimation,
  )
    ? state.skeletonAnimation
    : SKELETON_DEFAULTS.skeletonAnimation
  return { params: { skeleton: { animation } } }
}
