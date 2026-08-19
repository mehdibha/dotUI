"use client"

/* Card demo strips for the foundation chapters — inert, span/svg-based
   specimens (the card itself is the pressable) driven by each chapter's own
   state keys, cropped by the strip's right-edge fade. */

import {
  BanIcon,
  BellIcon,
  HomeIcon,
  MousePointer2Icon,
  PointerIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

import { fontStack } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { useLoadedFamilies } from "@/modules/create/typography"

import { DISABLED_LOOKS } from "../../sections/disabled"
import { focusRingShadow } from "../../sections/focus"
import { LINK_COLOR, LINK_REST } from "../../sections/links"
import {
  controlRadiusPx,
  cornerShapeStyle,
  roleRadiusPx,
} from "../../sections/shape"
import { spaceRecipe } from "../../sections/space"
import type { LabState } from "../../state"

/** The brand seed as a swatch beside its hex — the raw seed, no engine run. */
export function ColorDemo({ state }: { state: LabState }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5">
      <span
        className="size-6 shrink-0 rounded-md ring-1 ring-fg/10 ring-inset"
        style={{ backgroundColor: state.brand }}
      />
      <span className="font-mono text-xs text-fg-muted uppercase">
        {state.brand}
      </span>
    </span>
  )
}

/** "Ag" in the real heading face and weight, named beside it in the body face. */
export function TypographyDemo({ state }: { state: LabState }) {
  const family = state.headingFont || state.bodyFont
  useLoadedFamilies([family, state.bodyFont])
  return (
    <span className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
      <span
        className="text-fg"
        style={{
          fontFamily: fontStack(family),
          fontWeight: Number(state.headingWeight),
          fontSize: 27,
          lineHeight: 1,
        }}
      >
        Ag
      </span>
      <span className="flex flex-col gap-1">
        <span
          className="text-[0.8125rem] leading-none text-fg"
          style={{ fontFamily: fontStack(state.bodyFont) }}
        >
          {family}
        </span>
        <span className="text-xs leading-none text-fg-muted">
          {state.typeBase}px
        </span>
      </span>
    </span>
  )
}

/** A few registry-representative glyphs drawing with the current stroke. */
export function IconsDemo({ state }: { state: LabState }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5 text-fg-muted">
      {[HomeIcon, SearchIcon, BellIcon, SettingsIcon].map((Icon, i) => (
        <Icon key={i} className="size-4.5" strokeWidth={state.iconStroke} />
      ))}
    </span>
  )
}

/** Control and surface corners at their resolved radii, outlined. */
export function ShapeDemo({ state }: { state: LabState }) {
  const box = (key: "roleControl" | "roleSurface", size: string) => (
    <span
      className={cn("border border-fg/25 bg-fg/3", size)}
      style={{
        borderRadius: roleRadiusPx(state, key),
        ...cornerShapeStyle(state.cornerShape),
      }}
    />
  )
  return (
    <span className="flex shrink-0 items-center gap-2">
      {box("roleControl", "size-6")}
      {box("roleSurface", "size-8")}
    </span>
  )
}

/** Stacked bars whose gap is the resolved item gap — unit × density, live. */
export function SpaceDemo({ state }: { state: LabState }) {
  const r = spaceRecipe(state)
  return (
    <span className="flex shrink-0 flex-col" style={{ gap: r.itemGap }}>
      {["w-16", "w-12", "w-14"].map((width) => (
        <span
          key={width}
          className={cn("h-1.5 rounded-full bg-fg/25", width)}
        />
      ))}
    </span>
  )
}

/* Schematic card looks per strategy — neutral tokens, no engine run: fg-alpha
   tonal steps read darker on light and lighter on dark, like the real axis. */
const SURFACE_CARD: Record<string, string> = {
  hairline: "border border-fg/12 bg-card",
  adaptive: "bg-card shadow-sm",
  shadow: "bg-card shadow-md",
  outline: "border border-fg/25 bg-card shadow-xs",
  tonal: "bg-fg/8",
}

/** A tiny page tile holding a card wearing the separation strategy. */
export function SurfacesDemo({ state }: { state: LabState }) {
  return (
    <span className="relative h-9 w-14 shrink-0 rounded-md border border-border/45 bg-bg">
      <span
        className={cn(
          "absolute inset-x-2 top-2 bottom-2 rounded-sm",
          SURFACE_CARD[state.surfaceStrategy] ?? SURFACE_CARD.hairline,
        )}
      />
    </span>
  )
}

/** A primary chip wearing the real keyboard ring. */
export function FocusDemo({ state }: { state: LabState }) {
  return (
    <span
      className="flex h-7 shrink-0 items-center bg-primary px-3 text-[0.8125rem] font-medium text-fg-on-primary"
      style={{
        borderRadius: controlRadiusPx(state),
        boxShadow: focusRingShadow(state),
      }}
    >
      Focus
    </span>
  )
}

/** The interactive and disabled cursors the axes select, as glyphs. */
export function CursorDemo({ state }: { state: LabState }) {
  const Interactive =
    state.cursorControls === "pointer" ? PointerIcon : MousePointer2Icon
  const Disabled =
    state.cursorDisabled === "not-allowed" ? BanIcon : MousePointer2Icon
  return (
    <span className="flex shrink-0 items-center gap-3">
      <Interactive className="size-4.5 text-fg" />
      <Disabled className="size-4.5 text-fg-muted" />
    </span>
  )
}

/** The word pair wearing the highlight axis — literal OS blue vs accent. */
export function SelectionDemo({ state }: { state: LabState }) {
  const accent = state.selectionHighlight === "accent"
  return (
    <span className="shrink-0 text-[0.8125rem] whitespace-nowrap">
      <span
        className={cn(
          "rounded-xs px-0.5",
          accent
            ? "bg-accent text-fg-on-accent"
            : "bg-[#B3D7FF] text-[#1B1B1F]",
        )}
      >
        Selected text
      </span>
    </span>
  )
}

/** Content lines beside a track + thumb wearing the style axis. */
export function ScrollbarsDemo({ state }: { state: LabState }) {
  const style = state.scrollbarStyle
  return (
    <span className="flex h-8 shrink-0 items-stretch gap-2.5">
      <span className="flex flex-col justify-between py-0.5">
        {["w-14", "w-10", "w-12"].map((width) => (
          <span
            key={width}
            className={cn("h-1 rounded-full bg-fg/25", width)}
          />
        ))}
      </span>
      {style === "native" ? (
        <span className="relative w-[7px] rounded-full bg-fg/10">
          <span className="absolute inset-x-0 top-0 h-4 rounded-full bg-fg/40" />
        </span>
      ) : (
        <span
          className={cn(
            "w-[3px] rounded-full",
            style === "overlay" ? "h-4 bg-fg/15" : "h-4 bg-fg/40",
          )}
        />
      )}
    </span>
  )
}

/** A disabled control wearing the treatment recipe. */
export function DisabledDemo({ state }: { state: LabState }) {
  const look =
    DISABLED_LOOKS[state.disabledTreatment as keyof typeof DISABLED_LOOKS] ??
    DISABLED_LOOKS.fade
  return (
    <span
      className={cn(
        "flex h-7 shrink-0 items-center rounded-lg px-3 text-[0.8125rem] font-medium",
        look.primary,
      )}
    >
      Disabled
    </span>
  )
}

/* The section's own curve drawings, static — one per easing character. */
const MOTION_CURVES: Record<string, string> = {
  standard: "M4 20C8 9 12 6 20 6",
  emphasized: "M4 20C5 8 9 6 20 6",
  spring: "M4 20C6 6 6.5 2 9.5 3.5 12 4.8 12.5 8.2 15 7 17 6 18 6 20 6",
}

/** The easing character as a still curve settling on a dashed line. */
export function MotionDemo({ state }: { state: LabState }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="size-8 shrink-0 text-fg"
    >
      <path
        d="M3 6h18"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2.5"
        opacity=".35"
      />
      <path
        d={MOTION_CURVES[state.motionCharacter] ?? MOTION_CURVES.standard}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="6" r="1.75" fill="currentColor" />
    </svg>
  )
}

/** A resting link wearing the underline and color axes. */
export function LinksDemo({ state }: { state: LabState }) {
  return (
    <span className="shrink-0 text-[0.8125rem] whitespace-nowrap">
      <span
        className={cn(
          LINK_COLOR[state.linkColor as keyof typeof LINK_COLOR],
          LINK_REST[state.linkUnderline as keyof typeof LINK_REST],
        )}
      >
        Learn more
      </span>
    </span>
  )
}
