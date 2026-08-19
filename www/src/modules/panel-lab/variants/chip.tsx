"use client"

/* Micro-previews — the "small things" on the right of a drill-in index row:
   a ~16px state-driven specimen beside the chevron. State-driven, never
   decorative: each one re-renders from the axes its chapter owns (real brand
   color, real font, real radius, real fill), or it doesn't exist — chapters
   with no honest tiny form (motion, cursor, dialogs…) show nothing. */

import { CheckIcon, HeartIcon } from "lucide-react"

import { fontStack } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"

import type { LabState } from "../state"

const BOX = "size-4 shrink-0"

/** The synced check fill (checkbox · radio · switch). */
const fill = (state: LabState) =>
  state.checkFill === "neutral" ? "bg-fg" : "bg-accent"

export function ChapterChip({ id, state }: { id: string; state: LabState }) {
  switch (id) {
    /* ------------------------------ Foundations ----------------------------- */
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
    case "icons":
      return (
        <HeartIcon
          className={`${BOX} text-fg-muted`}
          strokeWidth={state.iconStroke}
        />
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
          className={cn(
            BOX,
            "rounded-[4px] bg-card",
            state.surfaceStrategy === "shadow"
              ? "shadow-[0_2px_4px_rgb(0_0_0/0.35)]"
              : "border border-border",
          )}
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

    /* ------------------------------ Components ------------------------------ */
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
          className={cn(
            "h-2.5 w-4 shrink-0 rounded-[3px]",
            state.inputStyle === "filled"
              ? "bg-muted"
              : "border border-border-field",
          )}
        />
      )
    case "switch":
      return (
        <span
          className={cn(
            "flex h-3 w-5 shrink-0 items-center justify-end rounded-full p-0.5",
            fill(state),
          )}
        >
          <span className="size-2 rounded-full bg-white" />
        </span>
      )
    case "checkbox":
      return (
        <span
          className={cn(
            "flex size-3.5 shrink-0 items-center justify-center",
            fill(state),
            state.checkCorner === "rounded" ? "rounded-[4px]" : "rounded-none",
          )}
        >
          <CheckIcon className="size-2.5 text-white" strokeWidth={3} />
        </span>
      )
    case "radio":
      return (
        <span
          className={cn(
            "size-3.5 shrink-0 rounded-full border-[4px] bg-bg",
            state.checkFill === "neutral" ? "border-fg" : "border-accent",
          )}
        />
      )
    case "sliders":
      return (
        <span className="relative flex w-6 shrink-0 items-center">
          <span
            className={cn(
              "w-full rounded-full bg-muted",
              state.sliderTrack === "thin" ? "h-1" : "h-1.5",
            )}
          >
            <span className="block h-full w-3/5 rounded-full bg-accent" />
          </span>
          <span
            className={cn(
              "absolute left-3/5 -translate-x-1/2 border border-border bg-white shadow-sm",
              state.sliderThumb === "circle"
                ? "size-2.5 rounded-full"
                : "h-3 w-1 rounded-sm",
            )}
          />
        </span>
      )
    case "progress":
      return (
        <span
          className={cn(
            "w-6 shrink-0 overflow-hidden rounded-full bg-muted",
            state.progressTrack === "thin" ? "h-1" : "h-1.5",
          )}
        >
          <span className="block h-full w-3/5 rounded-full bg-accent" />
        </span>
      )
    case "spinner":
      return (
        <span
          className={`${BOX} rounded-full border-2 border-fg/20 border-t-fg/70`}
        />
      )
    case "badges":
      return (
        <span
          className={cn(
            "h-2.5 w-5 shrink-0",
            state.badgeShape === "pill" ? "rounded-full" : "rounded-[3px]",
            state.badgeStyle === "soft"
              ? "bg-accent/25"
              : state.badgeStyle === "outline"
                ? "border border-border"
                : "bg-accent",
          )}
        />
      )
    case "avatars":
      return (
        <span
          className={cn(
            "size-3.5 shrink-0",
            state.avatarShape === "circle" ? "rounded-full" : "rounded-[4px]",
            state.avatarFallback === "tinted" ? "bg-accent/30" : "bg-muted",
          )}
        />
      )
    case "kbd":
      return (
        <span
          className={cn(
            "h-3.5 w-4 shrink-0 rounded-[3px]",
            state.kbdTreatment === "chip" &&
              "border border-border bg-muted shadow-[0_1px_0_var(--color-border)]",
            state.kbdTreatment === "flat" && "bg-muted",
            state.kbdTreatment === "outline" && "border border-border",
          )}
        />
      )
    case "tabs":
      return (
        <span className="flex w-6 shrink-0 flex-col gap-0.5">
          <span className="flex gap-1">
            <span className="h-1 w-2.5 rounded-full bg-fg/70" />
            <span className="h-1 w-2.5 rounded-full bg-fg/25" />
          </span>
          {state.tabStyle === "line" && (
            <span className="h-0.5 w-2.5 rounded-full bg-fg" />
          )}
        </span>
      )
    case "menus":
      return (
        <span className="flex h-4 w-5 shrink-0 flex-col justify-center gap-0.5 rounded-[3px] border border-border px-0.5">
          <span
            className={cn(
              "h-1 w-full rounded-sm",
              state.menuHighlight === "accent" ? "bg-accent" : "bg-fg/25",
            )}
          />
          <span className="h-0.5 w-3/4 rounded-full bg-fg/25" />
        </span>
      )
    default:
      return null
  }
}
