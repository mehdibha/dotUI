"use client"

/* Kbd — how a keyboard shortcut wears its chrome, a three-way fork: plain
   muted text (macOS menus, Material, Spectrum, Carbon, shadcn's
   DropdownMenuShortcut), a flat muted chip (Linear, Raycast, Geist, shadcn
   Kbd, Radix Themes soft — and dotUI's current registry kbd, hence the
   default), or a raised keycap with border and bottom shadow (GitHub
   Primer, Polaris, Mantine, Radix Themes classic). Mono vs sans is baked
   per treatment, not exposed: text and chip are sans everywhere surveyed,
   keycaps go mono (Primer); no system crosses them. Ctrl+K vs ⌘K wording
   is platform mapping, not styling. LabKbd is exported for the Menus and
   Tooltips chapters, whose shortcut hints wear this choice. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const KBD_DEFAULTS = {
  kbdTreatment: "chip",
}

const TREATMENTS = {
  text: "font-sans text-xs tracking-widest text-fg-muted",
  chip: "h-5 min-w-5 justify-center rounded-sm bg-muted px-1 font-sans text-xs font-medium text-fg-muted",
  keycap:
    "h-5 min-w-5 justify-center rounded-[5px] border border-b-2 border-border bg-card px-1.5 font-mono text-[0.6875rem] text-fg-muted",
}

/** The shared specimen: menus and tooltips render their shortcut hints
 *  through this so one panel choice restyles every hint. */
export function LabKbd({
  treatment,
  className,
  children,
}: {
  treatment: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center select-none",
        TREATMENTS[treatment as keyof typeof TREATMENTS],
        className,
      )}
    >
      {children}
    </kbd>
  )
}

/* ------------------------------ Option glyphs ------------------------------ */

function KbdGlyph({ treatment }: { treatment: keyof typeof TREATMENTS }) {
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

const TREATMENT_OPTIONS: SelectRowOption[] = [
  { value: "text", label: "Text", illustration: <KbdGlyph treatment="text" /> },
  { value: "chip", label: "Chip", illustration: <KbdGlyph treatment="chip" /> },
  {
    value: "keycap",
    label: "Keycap",
    illustration: <KbdGlyph treatment="keycap" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

export function KbdHero({ state }: { state: LabState }) {
  const treatment = state.kbdTreatment
  return (
    <Hero className="flex-row items-center justify-evenly py-6">
      <span className="flex items-center gap-1">
        <LabKbd treatment={treatment}>⌘</LabKbd>
        <LabKbd treatment={treatment}>K</LabKbd>
      </span>
      <div className="w-44 rounded-lg border border-border/60 bg-card p-1 shadow-sm">
        <div className="flex items-center justify-between gap-3 px-2 py-1.5">
          <span className="text-[0.8125rem] text-fg">Duplicate</span>
          <LabKbd treatment={treatment}>⌘D</LabKbd>
        </div>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the shortcut treatment. */
export function kbdSummary(state: LabState): string {
  return (
    TREATMENT_OPTIONS.find((o) => o.value === state.kbdTreatment)?.label ??
    state.kbdTreatment
  )
}

export function KbdSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <KbdHero state={state} />
      <SelectRow
        label="Treatment"
        value={state.kbdTreatment}
        onChange={set("kbdTreatment")}
        options={TREATMENT_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
