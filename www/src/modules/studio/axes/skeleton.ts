/* Skeleton — how skeletons idle while content loads. Animation is the one
   place a design system runs continuous ambient motion — shimmer
   (Carbon/Ant) vs pulse (shadcn/MUI) vs none (Linear-style stillness).

   Motion: one cycle of the shimmer's sweep or the pulse's breath. An
   attachment in flight pulses on the same loop.

   Engine: `animation` is an enum param on `skeleton`, plus its
   `--studio-skeleton-loop-*` timing vars (attachment reads them too). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { resolveLoop } from "./motion"
import type { Loop } from "./motion"
import { LOOP, oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

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

export const SKELETON_SCHEMA: ChapterSchema<typeof SKELETON_DEFAULTS> = {
  skeletonAnimation: oneOf(ANIMATION_OPTIONS),
  skeletonMotion: LOOP,
}

export function resolveSkeleton(state: Effective): Resolved {
  return {
    tokens: resolveLoop("skeleton", state.skeletonMotion, MOTION),
    params: { skeleton: { animation: state.skeletonAnimation } },
  }
}

export const chapter = defineChapter({
  id: "skeleton",
  defaults: SKELETON_DEFAULTS,
  schema: SKELETON_SCHEMA,
  resolve: resolveSkeleton,
})
