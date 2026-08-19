"use client"

/* Identity chips — the "tiny chip" answer to the row-visual question: a
   16px state-driven glyph beside the chapter name. Identity chapters only;
   refinements stay text. Honest where cheap (real brand color, real font,
   real radius), schematic where honesty would cost a layout engine. */

import { fontStack } from "@/lib/fonts"

import type { LabState } from "../state"

const BOX = "size-4 shrink-0"

export function ChapterChip({ id, state }: { id: string; state: LabState }) {
  switch (id) {
    case "color":
      return (
        <span
          className={`${BOX} rounded-full`}
          style={{ backgroundColor: state.brand }}
        />
      )
    case "typography":
      return (
        <span
          className="w-4 shrink-0 text-center text-[13px]/4 font-semibold text-fg"
          style={{ fontFamily: fontStack(state.headingFont || state.bodyFont) }}
        >
          Ag
        </span>
      )
    case "shape":
      return (
        <span
          className={`${BOX} border-t-2 border-l-2 border-fg-muted`}
          style={{ borderTopLeftRadius: Math.min(state.radiusPx, 14) }}
        />
      )
    case "space":
      return (
        <span
          className={`${BOX} flex flex-col items-start justify-center`}
          style={{ gap: Math.max(2, Math.min(state.spacingUnit, 6)) }}
        >
          <span className="h-0.5 w-full rounded-full bg-fg-muted" />
          <span className="h-0.5 w-3/4 rounded-full bg-fg-muted" />
          <span className="h-0.5 w-full rounded-full bg-fg-muted" />
        </span>
      )
    case "surfaces":
      return (
        <span
          className={`${BOX} rounded-[4px] bg-card ${
            state.surfaceStrategy === "shadow"
              ? "shadow-[0_2px_4px_rgb(0_0_0/0.35)]"
              : "border border-border"
          }`}
        />
      )
    case "buttons":
      return (
        <span
          className="h-2.5 w-4 shrink-0 bg-primary"
          style={{
            borderRadius:
              state.buttonRadius === "pill"
                ? 999
                : state.buttonRadius === "sharp"
                  ? 0
                  : 3,
          }}
        />
      )
    case "inputs":
      return (
        <span
          className={`h-2.5 w-4 shrink-0 rounded-[3px] ${
            state.inputStyle === "filled"
              ? "bg-muted"
              : "border border-border-field"
          }`}
        />
      )
    case "focus":
      return (
        <span
          className="size-2.5 shrink-0 rounded-[3px] bg-neutral"
          style={{
            boxShadow: `0 0 0 1.5px var(--color-bg), 0 0 0 3px var(--${state.focusColor === "neutral" ? "neutral" : "accent"}-700)`,
          }}
        />
      )
    default:
      return null
  }
}
