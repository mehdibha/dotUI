"use client"

/* Selection — whether UI text can be selected, and what selecting content
   looks like. The model is Linear's one-line rule: a global switch kills
   selection on chrome and the arrow cursor rides along, while content stays
   selectable — the hero previews both surfaces so the split is visible.
   Highlight styles ::selection; the browser default never themes. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { ArrowCursor, GlyphBadge, IBeamCursor } from "./cursor"

export const SELECTION_DEFAULTS = {
  selectionUiText: "selectable",
  selectionHighlight: "browser",
}

const UI_TEXT_OPTIONS: SelectRowOption[] = [
  { value: "selectable", label: "Selectable", illustration: <IBeamCursor /> },
  { value: "none", label: "Non-selectable", illustration: <ArrowCursor /> },
]

/* Painted words, not cursors: the option is the highlight itself. The blue
   depicts the OS default, which is literal like the cursor drawings. */
const HIGHLIGHT_OPTIONS: SelectRowOption[] = [
  {
    value: "browser",
    label: "Browser",
    illustration: (
      <span className="rounded-xs bg-[#B3D7FF] px-1 text-sm text-[#1B1B1F]">
        Aa
      </span>
    ),
  },
  {
    value: "accent",
    label: "Accent",
    illustration: (
      <span className="rounded-xs bg-accent px-1 text-sm text-fg-on-accent">
        Aa
      </span>
    ),
  },
]

/* Content and chrome side by side: the sentence stays selectable under
   either switch — non-selectable systems opt content back in — while the
   label follows it, arrow cursor included. ::selection can't be forced to
   render, so the sentence asks to be selected instead of faking it. */
function SelectionHero({ state }: { state: LabState }) {
  const none = state.selectionUiText === "none"
  return (
    <Hero className="gap-2 px-5 py-5">
      {state.selectionHighlight === "accent" && (
        <style>{`[data-selection-hero] ::selection { background: var(--color-accent); color: var(--color-fg-on-accent); }`}</style>
      )}
      <div data-selection-hero="" className="flex flex-col items-start gap-2">
        <p className="cursor-text text-sm text-fg">
          Select this sentence — content always allows it.
        </p>
        <span
          className={cn(
            "relative text-xs text-fg-muted",
            none && "cursor-default select-none",
          )}
        >
          UI label
          <GlyphBadge>{none ? <ArrowCursor /> : <IBeamCursor />}</GlyphBadge>
        </span>
      </div>
    </Hero>
  )
}

export function SelectionSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <SelectionHero state={state} />
      <SelectRow
        label="UI text"
        value={state.selectionUiText}
        onChange={set("selectionUiText")}
        options={UI_TEXT_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Highlight"
        value={state.selectionHighlight}
        onChange={set("selectionHighlight")}
        options={HIGHLIGHT_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
