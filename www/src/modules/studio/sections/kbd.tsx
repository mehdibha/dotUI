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
   every treatment. */

import { TREATMENT_OPTIONS } from "../axes/kbd"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

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

const TREATMENT_ROW_OPTIONS: SelectRowOption[] = TREATMENT_OPTIONS.map((o) => ({
  ...o,
  illustration: <KbdGlyph treatment={o.value} />,
}))

export function KbdSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
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
