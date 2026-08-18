"use client"

/* Dialogs — how modal layers meet the page, shared by Dialog, Drawer and
   Popover. Backdrop is the loudest split: shadcn/Radix and Vaul drop a plain
   black scrim (~black/50) over the page; Apple sheets, visionOS and Arc dim
   less but frost what's behind with a backdrop blur; Linear's dialogs and
   palettes use no scrim at all — elevation is carried by shadow alone, the
   page stays legible. Position is where a dialog rests: the classic modal
   centers, while Linear and Raycast dock it in the upper third — a
   command-palette habit that keeps the top edge fixed so the box never jumps
   as results grow. The hero is a mini app viewport: skeleton page content
   behind, the chosen backdrop over it, the dialog card at the chosen
   position. */

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
} from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
}

const BACKDROP = {
  dim: "bg-overlay/50",
  blur: "bg-overlay/30 backdrop-blur-[3px]",
  none: "",
}

const DIALOG_POSITION = {
  center: "top-1/2 -translate-y-1/2",
  top: "top-4",
}

/* ------------------------------ Option glyphs ------------------------------ */

/** The viewport with its scrim treatment: what the page reads like under the
 *  open layer — dimmed away, frosted, or crisp with only a shadow between. */
function BackdropGlyph({ treatment }: { treatment: "dim" | "blur" | "none" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {treatment !== "dim" && (
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={treatment === "blur" ? 2.25 : 1.25}
          opacity={treatment === "blur" ? 0.25 : 0.45}
        >
          <path d="M6 8.5h6" />
          <path d="M6 15.5h5" />
          <path d="M15 15.5h3" />
        </g>
      )}
      {treatment !== "none" && (
        <rect
          x="3.75"
          y="5.75"
          width="16.5"
          height="12.5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={treatment === "dim" ? 0.32 : 0.15}
        />
      )}
      <rect x="8.5" y="9" width="7" height="5.5" rx="1" fill="currentColor" />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const BACKDROP_OPTIONS: SelectRowOption[] = [
  {
    value: "dim",
    label: "Dim",
    illustration: <BackdropGlyph treatment="dim" />,
  },
  {
    value: "blur",
    label: "Blur",
    illustration: <BackdropGlyph treatment="blur" />,
  },
  {
    value: "none",
    label: "None",
    illustration: <BackdropGlyph treatment="none" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

export function DialogsHero({ state }: { state: LabState }) {
  return (
    <Hero inset={false} className="relative h-44">
      {/* Page content: what the backdrop dims, frosts, or leaves alone. */}
      <div className="flex flex-col gap-2 p-3">
        <div className="h-2 w-20 rounded-full bg-fg/20" />
        <div className="h-1.5 w-4/5 rounded-full bg-fg/10" />
        <div className="h-1.5 w-full rounded-full bg-fg/10" />
        <div className="h-1.5 w-3/5 rounded-full bg-fg/10" />
      </div>
      <div
        className={cn(
          "absolute inset-0",
          BACKDROP[state.dialogBackdrop as keyof typeof BACKDROP],
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 w-36 -translate-x-1/2 rounded-lg border border-border/60 bg-card p-2.5 shadow-xl",
          DIALOG_POSITION[state.dialogPosition as keyof typeof DIALOG_POSITION],
        )}
      >
        <div className="h-1.5 w-16 rounded-full bg-fg/60" />
        <div className="mt-2 h-1.5 w-24 rounded-full bg-fg/15" />
        <div className="mt-2.5 flex justify-end gap-1.5">
          <span className="h-4 w-10 rounded-[5px] border border-border bg-muted" />
          <span className="h-4 w-10 rounded-[5px] bg-accent" />
        </div>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the backdrop treatment, and where the dialog rests. */
export function dialogsSummary(state: LabState): string {
  const backdrop =
    BACKDROP_OPTIONS.find((o) => o.value === state.dialogBackdrop)?.label ??
    state.dialogBackdrop
  const position = state.dialogPosition === "top" ? "Top" : "Center"
  const first =
    state.dialogBackdrop === "none" ? "No backdrop" : `${backdrop} backdrop`
  return `${first} · ${position}`
}

export function DialogsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <DialogsHero state={state} />
      <SelectRow
        label="Backdrop"
        value={state.dialogBackdrop}
        onChange={set("dialogBackdrop")}
        options={BACKDROP_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Position"
        value={state.dialogPosition}
        onChange={set("dialogPosition")}
        options={[
          { value: "center", label: "Center" },
          { value: "top", label: "Top" },
        ]}
      />
    </ControlGroup>
  )
}
