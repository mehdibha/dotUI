"use client"

/* Selection — whether UI text can be selected, and what selecting content
   looks like. The model is Linear's one-line rule: a global switch kills
   selection on chrome and the arrow cursor rides along, while content stays
   selectable — the hero previews both surfaces so the split is visible.
   Highlight styles ::selection; the browser default never themes. */

import type { CSSProperties } from "react"

import {
  HIGHLIGHT_OPTIONS,
  resolveSelection,
  UI_TEXT_OPTIONS,
} from "../axes/selection"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { ArrowCursor, GlyphBadge, IBeamCursor } from "./cursor"

const UI_TEXT_ILLUSTRATIONS: Record<string, React.ReactNode> = {
  selectable: <IBeamCursor />,
  none: <ArrowCursor />,
}

/* Painted words, not cursors: the option is the highlight itself. The blue
   depicts the OS default, which is literal like the cursor drawings. */
const HIGHLIGHT_ILLUSTRATIONS: Record<string, React.ReactNode> = {
  browser: (
    <span className="rounded-xs bg-[#B3D7FF] px-1 text-sm text-[#1B1B1F]">
      Aa
    </span>
  ),
  accent: (
    <span className="rounded-xs bg-accent px-1 text-sm text-fg-on-accent">
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
   content back in — while the label (a control label, so base.css's rule
   reaches it) follows the switch, arrow cursor included. ::selection can't
   be forced to render, so the sentence asks to be selected instead. */
export function SelectionHero({ state }: { state: LabState }) {
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
        <label className="relative text-xs text-fg-muted">
          UI label
          <GlyphBadge>{none ? <ArrowCursor /> : <IBeamCursor />}</GlyphBadge>
        </label>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the UI-text selectability, and the highlight. */
export function selectionSummary(state: LabState): string {
  const uiText =
    UI_TEXT_OPTIONS.find((o) => o.value === state.selectionUiText)?.label ??
    state.selectionUiText
  const highlight =
    HIGHLIGHT_OPTIONS.find((o) => o.value === state.selectionHighlight)
      ?.label ?? state.selectionHighlight
  return `${uiText} text · ${highlight} highlight`
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
