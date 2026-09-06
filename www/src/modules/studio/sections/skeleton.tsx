"use client"

/* Skeleton — how skeletons idle while content loads: shimmer vs pulse vs
   none. The hero is the registry Skeleton under a provider carrying only
   this chapter's param — it shows exactly what the preview does. */

import { useMemo } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import { Skeleton } from "@/registry/ui/skeleton"

import { ANIMATION_OPTIONS, resolveSkeleton } from "../axes/skeleton"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function SkeletonShimmerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="9"
        width="16"
        height="6"
        rx="2"
        fill="currentColor"
        opacity=".3"
      />
      <path
        d="M12.5 9l-3 6"
        stroke="currentColor"
        strokeWidth="2"
        opacity=".8"
      />
    </svg>
  )
}

function SkeletonPulseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="6.5"
        y="9"
        width="11"
        height="6"
        rx="2"
        fill="currentColor"
        opacity=".45"
      />
      <path
        d="M4 8.5c-1.2 2-1.2 5 0 7M20 8.5c1.2 2 1.2 5 0 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".5"
      />
    </svg>
  )
}

function SkeletonNoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="9"
        width="16"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".6"
      />
    </svg>
  )
}

const GLYPHS: Record<string, React.ReactNode> = {
  shimmer: <SkeletonShimmerGlyph />,
  pulse: <SkeletonPulseGlyph />,
  none: <SkeletonNoneGlyph />,
}

const SKELETON_OPTIONS: SelectRowOption[] = ANIMATION_OPTIONS.map((option) => ({
  ...option,
  illustration: GLYPHS[option.value],
}))

/* ---------------------------------- Hero ----------------------------------- */

/* One content card, wearing the idle treatment. */
export function SkeletonHero({ state }: { state: StudioState }) {
  const params = useMemo(() => resolveSkeleton(state).params, [state])
  return (
    <Hero>
      <div className="flex min-h-16 items-center rounded-lg border border-border/60 bg-card p-3">
        <DesignSystemProvider params={params}>
          <Skeleton isLoading>
            <div className="flex items-center gap-2.5">
              <span data-skeleton="circle" className="size-8" />
              <div className="flex flex-col gap-1.5">
                <span data-skeleton="block" className="h-2.5 w-24 rounded-sm" />
                <span data-skeleton="block" className="h-2.5 w-16 rounded-sm" />
              </div>
            </div>
          </Skeleton>
        </DesignSystemProvider>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the idle animation. */
export function skeletonSummary(state: StudioState): string {
  return (
    ANIMATION_OPTIONS.find((o) => o.value === state.skeletonAnimation)?.label ??
    state.skeletonAnimation
  )
}

export function SkeletonSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SkeletonHero state={state} />
      <SelectRow
        label="Animation"
        value={state.skeletonAnimation}
        onChange={set("skeletonAnimation")}
        options={SKELETON_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
