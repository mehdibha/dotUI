"use client"

/* The section-hero contract — the grammar every section preview shares while
   keeping its own specimen:

   - Position: the hero is the first child of a section body, always.
   - Stage: one container (Hero). Neutral fill for mode-invariant axes (Type,
     Icons, Shape); mode-differentiated axes (Surfaces) paint their own tiles
     side by side inside HeroModes — both modes read together, never toggled.
   - Inspection: one verb everywhere (useInspect) — hover/focus peeks, click
     pins. The readout is a HeroInspector line: subject left, mono recipe right.
   - Engine-true: everything in a hero is driven by real state — real fonts,
     real registry icons, real engine colors. Live is the bar, not realistic:
     Shape's arc diagram qualifies because it draws the actual radii. */

import { createContext, useContext, useState } from "react"

import { cn } from "@/registry/lib/utils"

/** What a section opens on. `none` drops the hero and starts on controls. */
export type PreviewMode = "none" | "hero"
export const PreviewModeContext = createContext<PreviewMode>("hero")

/** The stage. `inset` pads content; full-bleed heroes (a grid with a footer
 *  bar) turn it off and manage their own edges. */
export function Hero({
  inset = true,
  className,
  children,
}: {
  inset?: boolean
  className?: string
  children: React.ReactNode
}) {
  if (useContext(PreviewModeContext) === "none") return null
  return (
    <div
      className={cn(
        // The app background, not panel chrome — specimens read as product
        // surface, matching the OptionGrid card treatment.
        "flex w-full flex-col overflow-hidden rounded-xl border border-border/45 bg-bg",
        inset && "gap-2.5 p-3",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Side-by-side mode tiles — the stage for mode-differentiated axes, where
 *  "right in light, wrong in dark" is the failure mode being shopped for. */
export function HeroModes({ children }: { children: React.ReactNode }) {
  if (useContext(PreviewModeContext) === "none") return null
  return <div className="flex gap-2">{children}</div>
}

/** The shared readout: what's inspected on the left, its recipe in mono on
 *  the right. `bar` renders it as a full-bleed footer for non-inset heroes. */
export function HeroInspector({
  label,
  detail,
  bar,
}: {
  label: React.ReactNode
  detail?: React.ReactNode
  bar?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-xs text-fg-muted",
        bar && "h-11 border-t border-border/45 px-4",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">{label}</span>
      {detail && (
        <span className="shrink-0 font-mono tabular-nums">{detail}</span>
      )}
    </div>
  )
}

/** The inspection verb: hover/focus peeks (transient), click pins (sticky,
 *  aria-pressed), click again unpins. Spread `probeProps(id)` on any probe
 *  button; `inspected` (peek over pin) drives the readout. */
export function useInspect<T extends string>(defaultPinned: T | null = null) {
  const [pinned, setPinned] = useState<T | null>(defaultPinned)
  const [peeked, setPeeked] = useState<T | null>(null)
  const probeProps = (id: T) => ({
    "aria-pressed": pinned === id,
    onMouseEnter: () => setPeeked(id),
    onMouseLeave: () => setPeeked((p) => (p === id ? null : p)),
    onFocus: () => setPeeked(id),
    onBlur: () => setPeeked((p) => (p === id ? null : p)),
    onClick: () => setPinned((p) => (p === id ? null : id)),
  })
  return { inspected: peeked ?? pinned, pinned, probeProps }
}
