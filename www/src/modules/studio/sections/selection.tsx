"use client"

/* Selection — whether UI text can be selected, and what selecting content
   looks like. The model is Linear's one-line rule: a global switch kills
   selection on chrome and the arrow cursor rides along, while content stays
   selectable — the hero previews both surfaces so the split is visible.
   Highlight styles ::selection: the system's own tint, or the OS default. */

import type { CSSProperties } from "react"

import {
  HIGHLIGHT_OPTIONS,
  resolveSelection,
  UI_TEXT_OPTIONS,
} from "../axes/selection"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"
import { ArrowCursor, GlyphBadge, IBeamCursor } from "./cursor"

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

/* Content and chrome side by side, wearing the engine's own tokens: the
   sentence stays selectable under either switch — non-selectable systems opt
   content back in — while the label wears `select-ui` like every control, so
   it follows the switch, arrow cursor included. ::selection can't be forced
   to render, so the sentence asks to be selected instead. */
export function SelectionHero({ state }: { state: StudioState }) {
  const none = state.selectionUiText === "none"
  return (
    <Hero className="px-5 py-5">
      <div
        className="flex flex-col items-start gap-2"
        style={resolveSelection(state).tokens as CSSProperties}
      >
        <p className="cursor-text text-sm text-fg">
          Select this sentence — content always allows it.
        </p>
        <span className="relative text-xs text-fg-muted select-ui">
          UI label
          <GlyphBadge>{none ? <ArrowCursor /> : <IBeamCursor />}</GlyphBadge>
        </span>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the UI-text selectability, and the highlight. */
export function selectionSummary(state: StudioState): string {
  const uiText =
    UI_TEXT_OPTIONS.find((o) => o.value === state.selectionUiText)?.label ??
    state.selectionUiText
  const highlight =
    HIGHLIGHT_OPTIONS.find((o) => o.value === state.selectionHighlight)
      ?.label ?? state.selectionHighlight
  return `${uiText} text · ${highlight} highlight`
}

export function SelectionSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectionHero state={state} />
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
