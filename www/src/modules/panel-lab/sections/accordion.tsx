"use client"

/* Accordion — one literal language for accordion and disclosure (disclosure
   is the single-item primitive; every decision here applies to both).
   Container: divided — hairline-separated full-bleed rows (shadcn, Radix
   Themes, Spectrum) — vs boxed — one bordered surface with internal
   dividers (Ant, Bootstrap, HeroUI bordered) — vs cards — each item its own
   separated card (Material expansion panels, HeroUI splitted, marketing
   FAQs). Marker: chevron (shadcn, Radix, Spectrum, Carbon) vs plus/minus
   (GOV.UK lineage, marketing FAQ patterns). Position: trailing (shadcn,
   Radix, Material) vs leading (GOV.UK, Polaris, Carbon). Rejected:
   open-item tint — shadcn, Radix, Spectrum, Carbon, Material all leave the
   open item unfilled; a tinted open row is a product one-off, not a system
   fork. Multiple-open is behavior, a prop (Radix type="multiple"); expand
   motion lives in the Motion chapter. */

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
} from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const ACCORDION_DEFAULTS = {
  accordionContainer: "divided",
  accordionMarker: "chevron",
  accordionMarkerPosition: "trailing",
}

/* ------------------------------ Option glyphs ------------------------------ */

function ContainerGlyph({ style }: { style: "divided" | "boxed" | "cards" }) {
  if (style === "cards")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        {[3.5, 10, 16.5].map((y) => (
          <rect
            key={y}
            x="4"
            y={y}
            width="16"
            height="4"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {style === "boxed" && (
        <rect
          x="3.75"
          y="4.25"
          width="16.5"
          height="15.5"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      <path
        d="M4 9.5h16M4 14.5h16"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".4"
      />
      {[5.75, 11, 16.25].map((y) => (
        <rect
          key={y}
          x="7"
          y={y}
          width="10"
          height="2"
          rx="1"
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

function MarkerGlyph({ glyph }: { glyph: "chevron" | "plus" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {glyph === "chevron" ? (
        <path d="M7 10l5 5 5-5" strokeLinejoin="round" />
      ) : (
        <path d="M12 6v12M6 12h12" />
      )}
    </svg>
  )
}

const CONTAINER_OPTIONS: SelectRowOption[] = [
  {
    value: "divided",
    label: "Divided",
    illustration: <ContainerGlyph style="divided" />,
  },
  {
    value: "boxed",
    label: "Boxed",
    illustration: <ContainerGlyph style="boxed" />,
  },
  {
    value: "cards",
    label: "Cards",
    illustration: <ContainerGlyph style="cards" />,
  },
]

const MARKER_OPTIONS: SelectRowOption[] = [
  {
    value: "chevron",
    label: "Chevron",
    illustration: <MarkerGlyph glyph="chevron" />,
  },
  { value: "plus", label: "Plus", illustration: <MarkerGlyph glyph="plus" /> },
]

const POSITION_OPTIONS = [
  { value: "leading", label: "Leading" },
  { value: "trailing", label: "Trailing" },
]

/* ---------------------------------- Hero ----------------------------------- */

const CONTAINER = {
  divided: { list: "divide-y divide-border", item: "" },
  boxed: {
    list: "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
    item: "px-3",
  },
  cards: {
    list: "gap-2",
    item: "rounded-lg border border-border bg-card px-3",
  },
}

function Marker({ open, state }: { open: boolean; state: LabState }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className={cn(
        "size-3 shrink-0 text-fg-muted",
        state.accordionMarker === "chevron" && open && "rotate-180",
      )}
    >
      {state.accordionMarker === "chevron" ? (
        <path d="M2.5 4.25 6 7.75l3.5-3.5" strokeLinejoin="round" />
      ) : (
        <path d={open ? "M1.5 6h9" : "M6 1.5v9M1.5 6h9"} />
      )}
    </svg>
  )
}

function AccordionItem({
  label,
  open = false,
  state,
}: {
  label: string
  open?: boolean
  state: LabState
}) {
  const container =
    CONTAINER[state.accordionContainer as keyof typeof CONTAINER]
  const trailing = state.accordionMarkerPosition === "trailing"
  return (
    <div className={container.item}>
      <div
        className={cn(
          "flex items-center gap-2 py-2.5",
          trailing && "justify-between",
        )}
      >
        {!trailing && <Marker open={open} state={state} />}
        <span className="text-[0.8125rem] font-medium text-fg">{label}</span>
        {trailing && <Marker open={open} state={state} />}
      </div>
      {open && (
        <div className="flex flex-col gap-1.5 pb-3">
          <span className="h-2 w-full rounded-full bg-muted" />
          <span className="h-2 w-3/4 rounded-full bg-muted" />
        </div>
      )}
    </div>
  )
}

function AccordionHero({ state }: { state: LabState }) {
  const container =
    CONTAINER[state.accordionContainer as keyof typeof CONTAINER]
  return (
    <Hero className="px-4 py-4">
      <div className={cn("flex w-full flex-col", container.list)}>
        <AccordionItem label="Shipping" state={state} />
        <AccordionItem label="Returns" open state={state} />
        <AccordionItem label="Warranty" state={state} />
      </div>
    </Hero>
  )
}

export function AccordionSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <AccordionHero state={state} />
      <SelectRow
        label="Container"
        value={state.accordionContainer}
        onChange={set("accordionContainer")}
        options={CONTAINER_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Marker"
        value={state.accordionMarker}
        onChange={set("accordionMarker")}
        options={MARKER_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Position"
        value={state.accordionMarkerPosition}
        onChange={set("accordionMarkerPosition")}
        options={POSITION_OPTIONS}
      />
    </ControlGroup>
  )
}
