"use client"

/* Badges — and Tags, one synced chip language: how much intent color the
   chip carries and its corners. Kbd is the third small chip, with a chrome
   of its own. */

import { cn } from "@/registry/lib/utils"

import { SHAPE_OPTIONS, STYLE_OPTIONS } from "../axes/badges"
import { TREATMENT_OPTIONS } from "../axes/kbd"
import { DialGlyph, DialSegmented, DialSelect } from "../dial"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

const CHIP: Record<string, string> = {
  solid: "bg-accent text-fg-on-accent",
  soft: "bg-accent-muted text-fg-accent",
  outline: "border border-border-accent text-fg-accent",
  "soft-outline": "border border-border-accent bg-accent-muted text-fg-accent",
}

/** The accent chip in one style and shape. */
function ChipGlyph({ style, shape }: { style: string; shape: string }) {
  return (
    <span
      className={cn(
        "flex h-4 shrink-0 items-center px-1.5 text-[9px] font-medium",
        shape === "pill" ? "rounded-full" : "rounded-[3px]",
        CHIP[style],
      )}
    >
      Badge
    </span>
  )
}

function KbdGlyph({ treatment }: { treatment: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {treatment === "chip" && (
        <rect
          x="3"
          y="7"
          width="18"
          height="10"
          rx="3"
          fill="currentColor"
          opacity=".15"
        />
      )}
      {treatment === "keycap" && (
        <>
          <rect
            x="4.5"
            y="4.5"
            width="15"
            height="13"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7.5 20.5h9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      <text
        x="12"
        y={treatment === "keycap" ? 11.5 : 12.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={treatment === "keycap" ? 7.5 : 8.5}
        fontWeight="500"
        fontFamily={
          treatment === "keycap" ? "ui-monospace, monospace" : undefined
        }
        fill="currentColor"
      >
        ⌘K
      </text>
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function BadgesPreview({ state }: { state: StudioState }) {
  return <ChipGlyph style={state.badgeStyle} shape={state.badgeShape} />
}

export function BadgesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Style"
        value={state.badgeStyle}
        onChange={set("badgeStyle")}
        rowPreview={false}
        options={STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: <ChipGlyph style={option.value} shape={state.badgeShape} />,
        }))}
      />
      <DialSegmented
        label="Shape"
        value={state.badgeShape}
        onChange={set("badgeShape")}
        options={SHAPE_OPTIONS}
      />
      <DialSelect
        label="Kbd"
        value={state.kbdTreatment}
        onChange={set("kbdTreatment")}
        options={TREATMENT_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <KbdGlyph treatment={option.value} />
            </DialGlyph>
          ),
        }))}
      />
    </>
  )
}
