"use client"

/* Feedback — a bucket: badges and tags, spinner, skeleton, progress. */

import { cn } from "@/registry/lib/utils"
import { Loader as BladesLoader } from "@/registry/ui/loader/base.blades"
import { Loader as DotsLoader } from "@/registry/ui/loader/base.dots"
import { Loader as RingLoader } from "@/registry/ui/loader/base.ring"

import { SHAPE_OPTIONS, STYLE_OPTIONS } from "../axes/badges"
import { INDETERMINATE_OPTIONS, TRACK_OPTIONS } from "../axes/progress"
import { ANIMATION_OPTIONS } from "../axes/skeleton"
import { STYLE_OPTIONS as SPINNER_OPTIONS } from "../axes/spinner"
import { DialGlyph, DialSegmented, DialSelect, DialToggle } from "../dial"
import {
  FamilyHero,
  HeroMember,
  MemberSection,
  More,
  UsesRow,
} from "../family-page"
import type { Effective, Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

const CHIP: Record<string, string> = {
  solid: "bg-accent text-fg-on-accent",
  soft: "bg-accent-muted text-fg-accent",
  outline: "border border-border-accent text-fg-accent",
  "soft-outline": "border border-border-accent bg-accent-muted text-fg-accent",
}

/** The accent chip in one style and shape. */
function ChipGlyph({
  style,
  shape,
  children = "New",
}: {
  style: string
  shape: string
  children?: string
}) {
  return (
    <span
      className={cn(
        "flex h-4 shrink-0 items-center px-1.5 text-[9px] font-medium",
        shape === "pill" ? "rounded-full" : "rounded-[3px]",
        CHIP[style],
      )}
    >
      {children}
    </span>
  )
}

/** An inline alert and a toast: members with no rows of their own yet. */
function AlertGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.75"
        y="6.75"
        width="18.5"
        height="10.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="7" cy="12" r="1.75" fill="currentColor" />
      <path
        d="M10.5 10.5h7M10.5 13.5h4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

function ToastGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.75"
        y="3.75"
        width="16.5"
        height="16.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <rect
        x="9"
        y="13.5"
        width="9"
        height="4.5"
        rx="1.25"
        fill="currentColor"
      />
    </svg>
  )
}

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

export function FeedbackPreview({ state }: { state: Effective }) {
  return <ChipGlyph style={state.badgeStyle} shape={state.badgeShape} />
}

export function FeedbackSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  const Spinner = LOADERS[effective.spinnerStyle] ?? RingLoader
  return (
    <>
      <FamilyHero>
        <HeroMember name="Badge">
          <ChipGlyph
            style={effective.badgeStyle}
            shape={effective.badgeShape}
          />
        </HeroMember>
        <HeroMember name="Tag">
          <ChipGlyph style={effective.badgeStyle} shape={effective.badgeShape}>
            Tag
          </ChipGlyph>
        </HeroMember>
        <HeroMember name="Alert">
          <DialGlyph>
            <AlertGlyph />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Toast">
          <DialGlyph>
            <ToastGlyph />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Spinner">
          <Spinner className="size-5" />
        </HeroMember>
        <HeroMember name="Skeleton">
          <DialGlyph>
            <SkeletonGlyph animation={effective.skeletonAnimation} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Progress bar">
          <DialGlyph>
            <ProgressGlyph
              track={effective.progressTrack}
              gap={effective.progressGap}
            />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialSelect
        axis="badgeStyle"
        label="Badge style"
        options={STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <ChipGlyph style={option.value} shape={effective.badgeShape} />
          ),
        }))}
      />
      <DialSegmented
        axis="badgeShape"
        label="Badge shape"
        options={SHAPE_OPTIONS}
      />
      <UsesRow axis="brand" label="Brand" />
      <UsesRow axis="motion" label="Motion" />
      <MemberSection id="loading" title="Loading">
        <DialSelect
          axis="spinnerStyle"
          label="Spinner"
          options={SPINNER_OPTIONS.map((option) => {
            const Loader = LOADERS[option.value] ?? RingLoader
            return { ...option, preview: <Loader className="size-4" /> }
          })}
        />
        <More
          keys={[
            "skeletonAnimation",
            "progressTrack",
            "progressIndeterminate",
            "progressGap",
          ]}
        >
          <DialSelect
            axis="skeletonAnimation"
            label="Skeleton"
            options={ANIMATION_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <SkeletonGlyph animation={option.value} />
                </DialGlyph>
              ),
            }))}
          />
          <DialSegmented
            axis="progressTrack"
            label="Progress"
            options={TRACK_OPTIONS}
          />
          <DialSegmented
            axis="progressIndeterminate"
            label="Indeterminate"
            options={INDETERMINATE_OPTIONS}
          />
          <DialToggle axis="progressGap" label="Track gap" />
        </More>
      </MemberSection>
    </>
  )
}
