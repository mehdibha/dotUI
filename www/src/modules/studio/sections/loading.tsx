"use client"

/* Loading — how the system waits: the skeleton's idle, the spinner's
   signature, the progress bar's build. The spinner options are the
   registry's own loaders, so the pick shows what ships. */

import { Loader as BladesLoader } from "@/registry/ui/loader/base.blades"
import { Loader as DotsLoader } from "@/registry/ui/loader/base.dots"
import { Loader as RingLoader } from "@/registry/ui/loader/base.ring"

import { INDETERMINATE_OPTIONS, TRACK_OPTIONS } from "../axes/progress"
import { ANIMATION_OPTIONS } from "../axes/skeleton"
import { STYLE_OPTIONS } from "../axes/spinner"
import {
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialToggle,
  DialTrigger,
  optionLabel,
} from "../dial"
import type { Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

function SkeletonGlyph({ animation }: { animation: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {animation === "none" ? (
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
      ) : (
        <rect
          x={animation === "pulse" ? 6.5 : 4}
          y="9"
          width={animation === "pulse" ? 11 : 16}
          height="6"
          rx="2"
          fill="currentColor"
          opacity={animation === "pulse" ? 0.45 : 0.3}
        />
      )}
      {animation === "shimmer" && (
        <path
          d="M12.5 9l-3 6"
          stroke="currentColor"
          strokeWidth="2"
          opacity=".8"
        />
      )}
      {animation === "pulse" && (
        <path
          d="M4 8.5c-1.2 2-1.2 5 0 7M20 8.5c1.2 2 1.2 5 0 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity=".5"
        />
      )}
    </svg>
  )
}

const LOADERS: Record<string, typeof RingLoader> = {
  ring: RingLoader,
  blades: BladesLoader,
  dots: DotsLoader,
}

function ProgressGlyph({ track, gap }: { track: string; gap: boolean }) {
  const weight = track === "thick" ? 5 : 2.5
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={gap ? "M14.5 12h5" : "M3 12h18"}
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        opacity=".3"
      />
      <path
        d="M3 12h9"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
      />
      {gap && <circle cx="21" cy="12" r="1.5" fill="currentColor" />}
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function LoadingSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Skeleton"
        value={state.skeletonAnimation}
        onChange={set("skeletonAnimation")}
        options={ANIMATION_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <SkeletonGlyph animation={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSelect
        label="Spinner"
        value={state.spinnerStyle}
        onChange={set("spinnerStyle")}
        rowPreview={false}
        options={STYLE_OPTIONS.map((option) => {
          const Loader = LOADERS[option.value] ?? RingLoader
          return { ...option, preview: <Loader className="size-4" /> }
        })}
      />
      <DialTrigger
        label="Progress"
        value={
          <>
            <span className="truncate">
              {optionLabel(TRACK_OPTIONS, state.progressTrack)} ·{" "}
              {optionLabel(INDETERMINATE_OPTIONS, state.progressIndeterminate)}
            </span>
            <DialGlyph>
              <ProgressGlyph
                track={state.progressTrack}
                gap={state.progressGap}
              />
            </DialGlyph>
          </>
        }
      >
        <DialPopover>
          <DialSegmented
            label="Track"
            value={state.progressTrack}
            onChange={set("progressTrack")}
            options={TRACK_OPTIONS}
          />
          <DialSegmented
            label="Indeterminate"
            value={state.progressIndeterminate}
            onChange={set("progressIndeterminate")}
            options={INDETERMINATE_OPTIONS}
          />
          <DialToggle
            label="Track gap"
            value={state.progressGap}
            onChange={set("progressGap")}
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
