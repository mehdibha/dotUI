/* Skeleton — how skeletons idle while content loads. Animation is the one
   place a design system runs continuous ambient motion — shimmer
   (Carbon/Ant) vs pulse (shadcn/MUI) vs none (Linear-style stillness).

   Motion: one cycle of the shimmer's sweep or the pulse's breath. An
   attachment in flight pulses on the same loop.

   Engine: `animation` is an enum param on `skeleton`, plus its
   `--studio-skeleton-loop-*` timing vars (attachment reads them too). */

import type { Resolved, StudioState } from "./index"
import { resolveLoop } from "./motion"
import type { Loop } from "./motion"

/* shadcn's skeleton: Tailwind's `animate-pulse`, 2s on its own curve. */
const MOTION: Loop = { cycle: 2000, ease: [0.4, 0, 0.6, 1] }

export const SKELETON_DEFAULTS = {
  skeletonAnimation: "shimmer",
  skeletonMotion: MOTION,
}

export const ANIMATION_OPTIONS = [
  { value: "shimmer", label: "Shimmer" },
  { value: "pulse", label: "Pulse" },
  { value: "none", label: "None" },
]

export function resolveSkeleton(state: StudioState): Resolved {
  const animation = ANIMATION_OPTIONS.some(
    (o) => o.value === state.skeletonAnimation,
  )
    ? state.skeletonAnimation
    : SKELETON_DEFAULTS.skeletonAnimation
  return {
    tokens: resolveLoop("skeleton", state.skeletonMotion, MOTION),
    params: { skeleton: { animation } },
  }
}
