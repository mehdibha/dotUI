"use client"

/* Selection controls — Checkbox, Radio, Switch and their card variant. A
   radio is always a circle and a switch a pill, so Corner stops at the box;
   each control's color is a leaf of Color's Primary. Choice cards are one
   treatment across all three. */

import { cn } from "@/registry/lib/utils"

import { CORNER_OPTIONS } from "../axes/checkbox"
import { CONTROL_OPTIONS, SELECTED_OPTIONS } from "../axes/choice-cards"
import {
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "../dial"
import { CardGrid } from "../patterns"
import type { Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

const CORNER_RX: Record<string, number> = { rounded: 3.5, square: 1, circle: 7 }

/** A checked box at one corner geometry. */
function CornerGlyph({ corner }: { corner: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx={CORNER_RX[corner] ?? 3.5}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m9 12.3 2.1 2.1 4-4.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const CARD_LOOK: Record<string, string> = {
  outline: "border-primary shadow-[inset_0_0_0_1px_var(--color-primary)]",
  tint: "border-fg/10 bg-primary/10",
  "outline-tint":
    "border-primary bg-primary/10 shadow-[inset_0_0_0_1px_var(--color-primary)]",
}

/** A chosen card: its selected treatment, the control where it sits. */
function CardGlyph({
  selected,
  control,
  card,
}: {
  selected: string
  control: string
  card?: boolean
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-md border",
        control === "end" && "flex-row-reverse",
        card ? "my-1 h-9 w-full px-2.5" : "h-4 w-8 px-1",
        CARD_LOOK[selected],
      )}
    >
      {control !== "hidden" && (
        <span
          className={cn(
            "shrink-0 rounded-full bg-primary",
            card ? "size-3" : "size-1.5",
          )}
        />
      )}
      <span
        className={cn("flex-1 rounded-full bg-fg/25", card ? "h-1.5" : "h-1")}
      />
    </span>
  )
}

/* --------------------------------- Section --------------------------------- */

export function SelectionControlsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Checkbox"
        value={state.checkCorner}
        onChange={set("checkCorner")}
        rowPreview={false}
        options={CORNER_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <CornerGlyph corner={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialTrigger
        label="Choice card"
        value={
          <>
            <span className="truncate">
              {optionLabel(SELECTED_OPTIONS, state.cardSelected)} ·{" "}
              {optionLabel(CONTROL_OPTIONS, state.cardControl)}
            </span>
            <CardGlyph
              selected={state.cardSelected}
              control={state.cardControl}
            />
          </>
        }
      >
        <DialPopover className="w-80">
          <CardGrid
            label="Selected"
            columns={3}
            value={state.cardSelected}
            onChange={set("cardSelected")}
            options={SELECTED_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              children: (
                <CardGlyph
                  selected={option.value}
                  control={state.cardControl}
                  card
                />
              ),
            }))}
          />
          <DialSegmented
            label="Control"
            value={state.cardControl}
            onChange={set("cardControl")}
            options={CONTROL_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
