/* Selection — whether UI text can be selected, and what selected content
   looks like. Engine: the `select-ui` utility (base.css) every control and
   label wears reads `--user-select-ui` (none unless a system opts text back
   in; the arrow cursor follows for free — `cursor: auto` is the arrow over
   unselectable text), and `::selection` reads the `text-selection` semantic
   pair, re-pointed at the OS highlight when the system leaves it alone. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

/* Defaults mirror the registry: controls are unselectable, `::selection` is
   the accent tint. */
export const SELECTION_DEFAULTS = {
  selectionUiText: "none",
  selectionHighlight: "accent",
}

export const UI_TEXT_OPTIONS = [
  {
    value: "none",
    label: "Non-selectable",
    description:
      "Dragging across a button, tab or menu item selects nothing; labels " +
      "and table text show the arrow instead of the I-beam.",
    seenIn: [
      "Radix Themes",
      "shadcn/ui",
      "Primer",
      "Spectrum 2",
      "HeroUI",
      "Chakra UI",
      "Geist",
      "Mantine",
      "coss ui",
    ],
  },
  {
    value: "selectable",
    label: "Selectable",
    description:
      "Control text selects like any page text. Buttons and items keep " +
      "their Controls cursor; labels and table text show the I-beam.",
    seenIn: ["Carbon", "Fluent 2"],
  },
]

export const HIGHLIGHT_OPTIONS = [
  {
    value: "accent",
    label: "Accent",
    description:
      "A light accent tint under dark text (a dark tint under light text " +
      "in dark mode).",
    seenIn: ["Radix Themes"],
  },
  {
    value: "browser",
    label: "Browser",
    description:
      "The operating system's highlight color (blue on macOS by default, " +
      "or the user's own choice).",
    seenIn: ["HeroUI"],
  },
]

export function resolveSelection(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.selectionUiText === "selectable")
    tokens["--user-select-ui"] = "auto"
  if (state.selectionHighlight === "browser") {
    tokens["--color-text-selection"] = "Highlight"
    tokens["--color-fg-on-text-selection"] = "HighlightText"
  }
  return { tokens }
}

export const SELECTION_SPEC = {
  label: "Selection",
  description:
    "Text selection: whether the labels of controls can be selected, and " +
    "the color selected text is painted in. Content text always stays " +
    "selectable.",
  axes: {
    selectionUiText: {
      label: "Selectable",
      description:
        "Whether text on buttons, toggles, tabs, tags, menu, list and tree " +
        "items, field labels, tables, kbd hints and avatar initials can be " +
        "selected by dragging.",
      value: { type: "enum", options: UI_TEXT_OPTIONS },
      guidance:
        "9 of 11 checked systems turn selection off on buttons, the native " +
        "app convention that keeps a double-click or drag from highlighting " +
        "a label; Carbon and Fluent 2 leave buttons at the browser default. " +
        "Selectable suits content-heavy products where users copy values " +
        "out of the UI.",
    },
    selectionHighlight: {
      label: "Highlight",
      description: "The background and text color of selected text.",
      value: { type: "enum", options: HIGHLIGHT_OPTIONS },
      guidance:
        "Radix Themes paints selection with a translucent accent (its focus " +
        "color), Chakra UI with a tint of the current color palette, Geist " +
        "with inverted near-black; HeroUI leaves the OS color. Browser " +
        "respects the user's system setting; Accent ties selection to the " +
        "brand.",
    },
  },
} satisfies ChapterSpec<typeof SELECTION_DEFAULTS>
