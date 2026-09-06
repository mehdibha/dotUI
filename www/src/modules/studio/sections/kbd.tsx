"use client"

/* Kbd — how a keyboard shortcut wears its chrome, a three-way fork: plain
   muted text (macOS menus, Material, Spectrum, Carbon, shadcn's
   DropdownMenuShortcut), a flat muted chip (Linear, Raycast, Geist, shadcn
   Kbd, Radix Themes soft — and dotUI's current registry kbd, hence the
   default), or a raised keycap with border and bottom shadow (GitHub
   Primer, Polaris, Mantine, Radix Themes classic). Mono vs sans is baked
   per treatment, not exposed: text and chip are sans everywhere surveyed,
   keycaps go mono (Primer); no system crosses them. Ctrl+K vs ⌘K wording
   is platform mapping, not styling. Menu and list-box items strip the
   chrome and keep the type, so a shortcut hint in a list reads as text in
   every treatment — the hero's menu row shows that. */

import { cn } from "@/registry/lib/utils"

import { TREATMENT_OPTIONS } from "../axes/kbd"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

const TYPE = {
  text: "font-sans text-xs tracking-widest",
  chip: "font-sans text-xs font-medium",
  keycap: "font-mono text-[0.6875rem]",
}

const CHROME = {
  text: "",
  chip: "h-5 min-w-5 justify-center rounded-sm bg-muted px-1",
  keycap:
    "h-5 min-w-5 justify-center rounded-[5px] border border-b-2 border-border bg-card px-1.5",
}

function LabKbd({
  treatment,
  bare,
  children,
}: {
  treatment: string
  /** Inside a menu row: type only, chrome stripped like the registry does. */
  bare?: boolean
  children: React.ReactNode
}) {
  const t = treatment as keyof typeof TYPE
  return (
    <kbd
      className={cn(
        "inline-flex items-center text-fg-muted select-none",
        TYPE[t],
        !bare && CHROME[t],
      )}
    >
      {children}
    </kbd>
  )
}

/* ------------------------------ Option glyphs ------------------------------ */

function KbdGlyph({ treatment }: { treatment: keyof typeof TYPE }) {
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

const TREATMENT_ROW_OPTIONS: SelectRowOption[] = TREATMENT_OPTIONS.map((o) => ({
  ...o,
  illustration: <KbdGlyph treatment={o.value as keyof typeof TYPE} />,
}))

/* ---------------------------------- Hero ----------------------------------- */

export function KbdHero({ state }: { state: StudioState }) {
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
          <LabKbd treatment={treatment} bare>
            ⌘D
          </LabKbd>
        </div>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the shortcut treatment. */
export function kbdSummary(state: StudioState): string {
  return (
    TREATMENT_OPTIONS.find((o) => o.value === state.kbdTreatment)?.label ??
    state.kbdTreatment
  )
}

export function KbdSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <KbdHero state={state} />
      <SelectRow
        label="Treatment"
        value={state.kbdTreatment}
        onChange={set("kbdTreatment")}
        options={TREATMENT_ROW_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
