"use client"

/* The section-hero contract — the grammar every section preview shares while
   keeping its own specimen:

   - Position: the hero opens the section — first child of its body, or the
     head cell of the ControlGroup its rows live in.
   - Stage: one container (Hero). Neutral fill for mode-invariant axes (Type,
     Icons, Shape); mode-differentiated axes (Surfaces) paint their own tiles
     side by side inside HeroModes — both modes read together, never toggled.
   - Engine-true: everything in a hero is driven by real state — real fonts,
     real registry icons, real engine colors. Live is the bar, not realistic:
     Shape's nested surfaces qualify because they wear the actual radii. */

import { createContext, useContext } from "react"

import { cn } from "@/registry/lib/utils"

/** What a section opens on. `none` drops the hero and starts on controls. */
export type PreviewMode = "none" | "hero"
export const PreviewModeContext = createContext<PreviewMode>("hero")

/** The stage. `inset` pads content; full-bleed heroes (a grid with a footer
 *  bar) turn it off and manage their own edges. `data-preview` is how a
 *  ControlGroup recognises the stage as its head cell and strips the card
 *  chrome — same opt-in shape as `data-row`, so a hero never has to know
 *  whether it was dropped in a group. */
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
      data-preview=""
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
