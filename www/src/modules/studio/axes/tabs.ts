/* Tabs — the selected-tab signature: segmented, line, pill or enclosed.

   Engine: the `style` enum param on `tabs` — every look ships as the
   `variant` prop's values, the param sets the default. Color is a leaf of
   Color's Primary: the `color` param paints the selected tab's ink per look. */

import { SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const TAB_DEFAULTS = {
  tabStyle: "segmented",
  tabsColor: "neutral",
}

export const TAB_STYLE_OPTIONS = [
  {
    value: "segmented",
    label: "Segmented",
    description:
      "Tabs sit in a muted track with 3px padding; the selected tab is a " +
      "raised chip with a small shadow that slides between tabs.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "line",
    label: "Line",
    description:
      "Bare tabs over a hairline; the selected tab gets a 2px bar on that " +
      "hairline, sliding between tabs.",
    seenIn: [
      "Radix Themes",
      "Material 3",
      "Spectrum 2",
      "Carbon",
      "Ant Design",
      "Chakra UI",
      "Mantine",
      "shadcn/ui",
    ],
  },
  {
    value: "pill",
    label: "Pill",
    description:
      "No track or hairline; the selected tab sits in a fully rounded wash " +
      "(Mantine's pills fill it solid instead).",
    seenIn: ["Mantine", "Fluent 2"],
  },
  {
    value: "enclosed",
    label: "Enclosed",
    description:
      "Folder tabs: the selected tab gets a border and the page background, " +
      "open at the bottom, so it merges with the panel below the hairline.",
    seenIn: ["Chakra UI", "Ant Design", "Mantine"],
  },
]

export function resolveTabs(state: StudioState): Resolved {
  const style = TAB_STYLE_OPTIONS.some((o) => o.value === state.tabStyle)
    ? state.tabStyle
    : TAB_DEFAULTS.tabStyle
  const color = SOURCE_OPTIONS.some((o) => o.value === state.tabsColor)
    ? state.tabsColor
    : TAB_DEFAULTS.tabsColor
  return { params: { tabs: { style, color } } }
}

const INKS: Record<string, { description: string; seenIn: string[] }> = {
  neutral: {
    description:
      "Selected label in the text color; the line bar is the text color, " +
      "segmented and pill washes stay gray.",
    seenIn: ["shadcn/ui", "Spectrum 2", "Chakra UI"],
  },
  accent: {
    description:
      "Selected label in the accent; the line bar is solid accent, segmented " +
      "and pill washes turn accent-tinted.",
    seenIn: ["Radix Themes", "Material 3", "Mantine"],
  },
}

export const TAB_SPEC = {
  label: "Tabs",
  description:
    "How a tab list marks the selected tab, and whether that mark is neutral " +
    "or brand-colored.",
  axes: {
    tabStyle: {
      label: "Tabs",
      description:
        "The default look of every tab list. All four ship as the `variant` " +
        "prop; this picks the one used when none is passed.",
      value: { type: "enum", options: TAB_STYLE_OPTIONS },
      guidance:
        "Line is the majority default: 7 of 8 systems checked (Radix " +
        "Themes, Material 3, Spectrum 2, Carbon, Ant, Chakra, Mantine) " +
        "underline the selected tab. Segmented is shadcn's default; " +
        "enclosed survives as a secondary variant (Chakra enclosed, Ant " +
        "card, Mantine outline) for editor-style or closable tabs. Pick segmented " +
        "for compact app toolbars, line for page-level navigation.",
    },
    tabsColor: {
      label: "Color",
      description:
        "What paints the selected tab's ink — its label and indicator. A " +
        "leaf of Color's Primary.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          ...INKS[option.value],
        })),
      },
      guidance:
        "Systems split evenly: shadcn, Spectrum 2 and Chakra keep the " +
        "indicator neutral; Radix Themes, Material 3 and Mantine color it " +
        "with the accent. Match the Buttons color so primary actions and " +
        "selection read as one voice.",
    },
  },
} satisfies ChapterSpec<typeof TAB_DEFAULTS>
