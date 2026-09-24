/* Cursor — what the pointer becomes over each kind of control: enabled,
   pending, disabled, draggable. Engine: four `--cursor-*` tokens in base.css
   that every registry component reads through the cursor-* utilities. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

/* Defaults mirror base.css. */
export const CURSOR_DEFAULTS = {
  cursorControls: "pointer",
  cursorPending: "default",
  cursorDragging: "inherit",
  cursorDisabled: "not-allowed",
}

export const CONTROLS_OPTIONS = [
  {
    value: "default",
    label: "Arrow",
    description: "The arrow stays over buttons and items, as in native apps.",
    seenIn: ["Radix Themes", "shadcn/ui", "Spectrum 2"],
  },
  {
    value: "pointer",
    label: "Hand",
    description: "The pointing hand over buttons and items, as over links.",
    seenIn: [
      "Primer",
      "Carbon",
      "Fluent 2",
      "Chakra UI",
      "HeroUI",
      "Geist",
      "Mantine",
      "coss ui",
    ],
  },
]

export const PENDING_OPTIONS = [
  {
    value: "default",
    label: "Arrow",
    description:
      "A pending button keeps the plain arrow; its spinner says busy.",
  },
  {
    value: "progress",
    label: "Progress",
    description: "Arrow with a spinning badge — busy, but still clickable.",
  },
  {
    value: "wait",
    label: "Wait",
    description: "The spinner alone — busy and blocked.",
  },
]

export const DRAGGING_OPTIONS = [
  {
    value: "inherit",
    label: "Arrow",
    description:
      "No grab hands: drag handles wear the Controls cursor, so they show " +
      "the hand when Controls is Hand.",
    seenIn: ["Radix Themes", "Carbon"],
  },
  {
    value: "grab",
    label: "Grab",
    description: "An open hand over handles, a closed fist while dragging.",
    seenIn: ["HeroUI"],
  },
]

export const DISABLED_OPTIONS = [
  {
    value: "default",
    label: "Arrow",
    description: "Disabled controls show the plain arrow.",
    seenIn: ["shadcn/ui", "HeroUI", "Spectrum 2", "coss ui"],
  },
  {
    value: "not-allowed",
    label: "Blocked",
    description: "The prohibition sign over disabled controls.",
    seenIn: [
      "Radix Themes",
      "Primer",
      "Carbon",
      "Fluent 2",
      "Chakra UI",
      "Geist",
      "Mantine",
    ],
  },
]

export function resolveCursor(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.cursorControls !== CURSOR_DEFAULTS.cursorControls)
    tokens["--cursor-interactive"] = state.cursorControls
  if (state.cursorPending !== CURSOR_DEFAULTS.cursorPending)
    tokens["--cursor-pending"] = state.cursorPending
  if (state.cursorDisabled !== CURSOR_DEFAULTS.cursorDisabled)
    tokens["--cursor-disabled"] = state.cursorDisabled
  if (state.cursorDragging === "grab") {
    tokens["--cursor-drag"] = "grab"
    tokens["--cursor-dragging"] = "grabbing"
  }
  return { tokens }
}

export const CURSOR_SPEC = {
  label: "Cursor",
  description:
    "What the mouse pointer becomes over the system's controls. Links keep " +
    "the hand in every system and are not part of it.",
  axes: {
    cursorControls: {
      label: "Controls",
      description:
        "The pointer over enabled buttons, toggles, menu and list items, " +
        "accordion and tree triggers, and calendar cells. Checkboxes, radios " +
        "and tabs keep the arrow either way; the switch track always shows " +
        "the hand.",
      value: { type: "enum", options: CONTROLS_OPTIONS },
      guidance:
        "8 of 11 checked systems put the hand on buttons; Radix Themes, " +
        "shadcn/ui and Spectrum 2 keep the arrow, the native convention " +
        "that the hand means a link. Chakra UI and Mantine put the hand " +
        "on buttons and the arrow on checkboxes and radios, as dotUI does " +
        "at Hand; Chakra UI also keeps the arrow on menu items. Pick Arrow " +
        "for app-like tools, Hand for web products.",
    },
    cursorPending: {
      label: "Pending",
      description:
        "The pointer over a button while its action is in flight (the " +
        "button shows a spinner).",
      value: { type: "enum", options: PENDING_OPTIONS },
      guidance:
        "None of the checked systems sets a pending cursor: Primer keeps " +
        "its button hand on loading buttons, HeroUI drops pointer events " +
        "on pending ones so the arrow shows. Progress suits a desktop-app " +
        "feel; Wait claims the whole page is blocked, which a pending " +
        "button rarely means.",
    },
    cursorDragging: {
      label: "Dragging",
      description:
        "The pointer over drag handles — slider tracks and thumbs, the " +
        "drawer handle, table row handles — and while dragging them.",
      value: { type: "enum", options: DRAGGING_OPTIONS },
      guidance:
        "Radix Themes and Carbon give sliders the same cursor as their " +
        "buttons; Chakra UI keeps the arrow on sliders under hand-cursor " +
        "buttons; HeroUI switches slider thumbs to grab/grabbing. Grab " +
        "hands suit canvases and reorderable lists.",
    },
    cursorDisabled: {
      label: "Disabled",
      description: "The pointer over disabled controls and fields.",
      value: { type: "enum", options: DISABLED_OPTIONS },
      guidance:
        "7 of 11 checked systems show not-allowed. shadcn/ui, coss ui and " +
        "HeroUI remove pointer events from disabled controls (HeroUI's " +
        "not-allowed token never shows because of it) and Spectrum 2 sets " +
        "nothing, so the arrow shows.",
    },
  },
} satisfies ChapterSpec<typeof CURSOR_DEFAULTS>
