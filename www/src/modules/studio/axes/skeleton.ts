/* Skeleton — how skeletons idle while content loads. Animation is the one
   place a design system runs continuous ambient motion — shimmer
   (Carbon/Ant) vs pulse (shadcn/MUI) vs none (Linear-style stillness).

   Engine: `animation` is an enum param on `skeleton`. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const SKELETON_DEFAULTS = {
  skeletonAnimation: "shimmer",
}

export const ANIMATION_OPTIONS = [
  {
    value: "shimmer",
    label: "Shimmer",
    description:
      "A band blended toward the page color sweeps across the muted placeholder every 2s.",
    seenIn: ["Carbon", "Ant Design", "Chakra UI"],
  },
  {
    value: "pulse",
    label: "Pulse",
    description:
      "The placeholder's opacity breathes between 100% and 50% every 2s.",
    seenIn: ["shadcn/ui", "Radix Themes", "Mantine", "Chakra UI"],
  },
  {
    value: "none",
    label: "None",
    description: "A still muted block.",
    seenIn: ["Ant Design", "Chakra UI"],
  },
]

export function resolveSkeleton(state: StudioState): Resolved {
  const animation = ANIMATION_OPTIONS.some(
    (o) => o.value === state.skeletonAnimation,
  )
    ? state.skeletonAnimation
    : SKELETON_DEFAULTS.skeletonAnimation
  return { params: { skeleton: { animation } } }
}

export const SKELETON_SPEC = {
  label: "Skeleton",
  description: "How loading placeholders idle while content arrives.",
  axes: {
    skeletonAnimation: {
      label: "Skeleton",
      description: "The ambient motion on every skeleton placeholder.",
      value: { type: "enum", options: ANIMATION_OPTIONS },
      guidance:
        "Pulse is the most common default — shadcn, Radix Themes, Mantine " +
        "and Chakra; Carbon sweeps a highlight; Ant stays still unless " +
        "`active`, then shimmers. Shimmer signals loading most strongly; " +
        "none suits calm, fast-loading apps where motion would flicker.",
    },
  },
} satisfies ChapterSpec<typeof SKELETON_DEFAULTS>
