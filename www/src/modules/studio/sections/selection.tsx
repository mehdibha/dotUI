"use client"

/* Selection — whether UI text can be selected, and what selecting content
   looks like. The model is Linear's one-line rule: a global switch kills
   selection on chrome and the arrow cursor rides along, while content stays
   selectable. Highlight styles ::selection: the system's own tint, or the
   OS default. */

import { HIGHLIGHT_OPTIONS, UI_TEXT_OPTIONS } from "../axes/selection"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"
import { ArrowCursor, IBeamCursor } from "./cursor"

const UI_TEXT_ILLUSTRATIONS: Record<string, React.ReactNode> = {
  selectable: <IBeamCursor />,
  none: <ArrowCursor />,
}

/* Painted words, not cursors: the option is the highlight itself. The blue
   depicts the OS default, which is literal like the cursor drawings. */
const HIGHLIGHT_ILLUSTRATIONS: Record<string, React.ReactNode> = {
  accent: (
    <span className="rounded-xs bg-text-selection px-1 text-sm text-fg-on-text-selection">
      Aa
    </span>
  ),
  browser: (
    <span className="rounded-xs bg-[#B3D7FF] px-1 text-sm text-[#1B1B1F]">
      Aa
    </span>
  ),
}

const uiTextOptions: SelectRowOption[] = UI_TEXT_OPTIONS.map((o) => ({
  ...o,
  illustration: UI_TEXT_ILLUSTRATIONS[o.value],
}))

const highlightOptions: SelectRowOption[] = HIGHLIGHT_OPTIONS.map((o) => ({
  ...o,
  illustration: HIGHLIGHT_ILLUSTRATIONS[o.value],
}))

/** Collapsed-row summary: the UI-text selectability, and the highlight. */
export function selectionSummary(state: StudioState): string {
  return (
    HIGHLIGHT_OPTIONS.find((o) => o.value === state.selectionHighlight)
      ?.label ?? state.selectionHighlight
  )
}

export function SelectionSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="UI text"
        value={state.selectionUiText}
        onChange={set("selectionUiText")}
        options={uiTextOptions}
        layout="grid"
      />
      <SelectRow
        label="Highlight"
        value={state.selectionHighlight}
        onChange={set("selectionHighlight")}
        options={highlightOptions}
        layout="grid"
      />
    </ControlGroup>
  )
}
