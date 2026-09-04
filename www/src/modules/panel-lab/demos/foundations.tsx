"use client"

/* Foundation-chapter illustrations — monochrome anatomy schematics (see
   ink.tsx). Color alone stays live: its subject IS the brand seed. */

import {
  BanIcon,
  BellIcon,
  HomeIcon,
  MousePointer2Icon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

import type { LabState } from "../state"
import { Bar } from "./ink"

/** The brand seed as a swatch — the raw seed, no engine run. */
export function ColorDemo({ state }: { state: LabState }) {
  return (
    <span
      className="size-5 shrink-0 rounded-md ring-1 ring-fg/10 ring-inset"
      style={{ backgroundColor: state.brand }}
    />
  )
}

/** The classic type-specimen pair — a large and a small "Ag". */
export function TypographyDemo() {
  return (
    <span className="flex shrink-0 items-baseline gap-1.5 whitespace-nowrap">
      <span className="text-lg leading-none font-semibold text-fg/85">Ag</span>
      <span className="text-[11px] leading-none font-medium text-fg/45">
        Ag
      </span>
    </span>
  )
}

/** A short run of registry-representative glyphs. */
export function IconsDemo() {
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-fg/55">
      {[HomeIcon, SearchIcon, BellIcon, SettingsIcon].map((Icon, i) => (
        <Icon key={i} className="size-4" strokeWidth={1.75} />
      ))}
    </span>
  )
}

/** A bare top-right corner arc whose stroke fades away from the corner. */
export function ShapeDemo() {
  return (
    <span
      aria-hidden
      className="relative size-5 shrink-0 overflow-hidden [mask-image:linear-gradient(225deg,black_35%,transparent_85%)]"
    >
      <span className="absolute top-0 right-0 size-8 rounded-tr-[10px] border-t-2 border-r-2 border-fg/50" />
    </span>
  )
}

/** A tiny three-panel layout — the gutters are the subject. */
export function SpaceDemo() {
  const panel = "rounded-[3px] bg-fg/20"
  return (
    <span className="flex h-7 w-13 shrink-0 gap-[5px]">
      <span className={`${panel} w-1/3 shrink-0`} />
      <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <span className={`${panel} flex-1`} />
        <span className={`${panel} flex-1`} />
      </span>
    </span>
  )
}

/** One raised card lifting off a flat neighbor. */
export function SurfacesDemo() {
  return (
    <span className="relative h-7 w-12 shrink-0">
      <span className="absolute inset-y-1 right-0 left-2 rounded-md bg-fg/10" />
      <span className="absolute inset-y-0 left-0 w-9 rounded-md border border-fg/25 bg-card shadow-xs" />
    </span>
  )
}

/** A bare chip wearing a keyboard ring — the ring is the subject. */
export function FocusDemo() {
  return (
    <span
      className="h-5 w-9 shrink-0 rounded-[5px] bg-fg/15"
      style={{
        boxShadow:
          "0 0 0 2px var(--color-muted), 0 0 0 4px color-mix(in oklab, var(--color-fg) 65%, transparent)",
      }}
    />
  )
}

/** A failed field: danger shell over its message line — the one semantic
 *  color the schematic keeps, since the axis is the red itself. */
export function InvalidDemo() {
  return (
    <span className="flex shrink-0 flex-col items-start gap-1">
      <span className="h-5 w-12 rounded-[5px] border border-border-danger bg-fg/5" />
      <Bar className="w-8 bg-fg-danger/60" />
    </span>
  )
}

/** The arrow hovering a control chip — filled dark with a light outline. */
export function CursorDemo() {
  return (
    <span className="relative shrink-0">
      <span className="block h-5 w-9 rounded-[5px] bg-fg/15" />
      <MousePointer2Icon className="absolute right-0.5 -bottom-1 size-3.5 fill-fg stroke-card" />
    </span>
  )
}

/** A run of words wearing the highlight. */
export function SelectionDemo() {
  return (
    <span className="shrink-0 text-[0.8125rem] whitespace-nowrap text-fg/85">
      <span className="rounded-xs bg-fg/20 px-0.5">Selected text</span>
    </span>
  )
}

/** Content lines beside a track and thumb. */
export function ScrollbarsDemo() {
  return (
    <span className="flex h-8 shrink-0 items-stretch gap-2.5">
      <span className="flex flex-col justify-between py-0.5">
        {["w-14", "w-10", "w-12"].map((width) => (
          <Bar key={width} className={width} />
        ))}
      </span>
      <span className="relative w-[7px] rounded-full bg-fg/10">
        <span className="absolute inset-x-0 top-0 h-4 rounded-full bg-fg/40" />
      </span>
    </span>
  )
}

/** A disabled button under the ban cursor. */
export function DisabledDemo() {
  return (
    <span className="relative shrink-0">
      <span className="flex h-7 shrink-0 items-center rounded-lg bg-(--neutral-a100) px-2.5 text-[11px] font-medium whitespace-nowrap text-(--neutral-600)">
        Save
      </span>
      <span className="absolute -right-1 -bottom-1 flex rounded-full bg-card p-px">
        <BanIcon className="size-3 text-fg" />
      </span>
    </span>
  )
}

/** An easing curve settling on a dashed line. */
export function MotionDemo() {
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
        d="M4 20C8 9 12 6 20 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="6" r="1.75" fill="currentColor" />
    </svg>
  )
}

/** A phone with a drawer docked at its foot — the touch layer. */
export function MobileDemo() {
  return (
    <span className="relative h-8 w-6 shrink-0 overflow-hidden rounded-[5px] border border-fg/30 bg-fg/10">
      <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 rounded-t-[3px] bg-card pt-1 shadow-md">
        <span className="h-0.5 w-2 rounded-full bg-fg/30" />
        <span className="flex w-full flex-col gap-0.5 px-1 pb-1">
          <Bar className="h-0.5 w-2.5 bg-fg/50" />
          <Bar className="h-0.5 w-2 bg-fg/15" />
        </span>
      </span>
    </span>
  )
}

/** A resting inline link. */
export function LinksDemo() {
  return (
    <span className="shrink-0 text-[0.8125rem] whitespace-nowrap">
      <span className="text-fg/85 underline decoration-fg/40 underline-offset-2">
        Learn more
      </span>
    </span>
  )
}
