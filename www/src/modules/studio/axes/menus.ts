/* Menus — one language for every floating list: Menu, Select and ComboBox
   listboxes, and the Command palette are one synced family, so one axis
   writes all of them.

   Engine: `indicator`, `highlight`, `inset` and `labels` are enum params on
   `menu` and `list-box` (highlight re-points the `--color-highlight` pair
   through the param's vars); `search` and `scale` are enum params on
   `command`, the search-led surface, which also takes `inset` so its list
   gutter follows the rows. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const MENU_DEFAULTS = {
  menuIndicator: "check-end",
  menuHighlight: "neutral",
  menuInset: "inset",
  menuLabels: "sentence",
  menuSearch: "field",
  menuScale: "default",
}

export const INDICATOR_OPTIONS = [
  {
    value: "check-start",
    label: "Leading check",
    description:
      "The check sits before the label; every item in a selectable list " +
      "reserves that gutter, so labels stay aligned.",
    seenIn: [
      "Radix Themes",
      "Base UI",
      "coss ui",
      "Mantine",
      "Fluent 2",
      "Primer",
      "Spectrum 2",
    ],
  },
  {
    value: "check-end",
    label: "Trailing check",
    description:
      "The check sits at the item's trailing edge; labels start flush with " +
      "unselectable items.",
    seenIn: ["HeroUI", "Carbon"],
  },
]

export const HIGHLIGHT_OPTIONS = [
  {
    value: "neutral",
    label: "Neutral",
    description:
      "The focused item takes a light neutral wash; text keeps its color.",
    seenIn: [
      "shadcn/ui",
      "Mantine",
      "Chakra UI",
      "HeroUI",
      "Spectrum 2",
      "Fluent 2",
      "Carbon",
    ],
  },
  {
    value: "accent",
    label: "Accent",
    description:
      "The focused item fills with the solid accent and its text and icons " +
      "invert to the on-accent color.",
    seenIn: ["Radix Themes", "Chakra UI", "React Aria"],
  },
]

export const INSET_OPTIONS = [
  {
    value: "inset",
    label: "Inset",
    description:
      "The list has a small padding and each item's highlight is a rounded " +
      "chip (Items radius role) floating in it.",
    seenIn: ["shadcn/ui", "Radix Themes", "Mantine", "Base UI", "React Aria"],
  },
  {
    value: "full-bleed",
    label: "Full bleed",
    description:
      "Items run edge to edge with square highlights and a wider text inset.",
    seenIn: ["Material 3", "Carbon"],
  },
]

export const LABEL_OPTIONS = [
  {
    value: "sentence",
    label: "Sentence",
    description: "Section headers in small muted text, as written.",
    seenIn: [
      "shadcn/ui",
      "Radix Themes",
      "Mantine",
      "HeroUI",
      "Primer",
      "Geist",
      "Spectrum 2",
      "Chakra UI",
      "Atlassian",
    ],
  },
  {
    value: "caps",
    label: "Caps",
    description: "Section headers in 11px medium uppercase with wide tracking.",
  },
]

export const SEARCH_OPTIONS = [
  {
    value: "field",
    label: "Field",
    description:
      "A boxed search field wearing the Inputs style, floating in the " +
      "palette's padding above the list.",
    seenIn: ["shadcn/ui", "React Aria"],
  },
  {
    value: "bar",
    label: "Bar",
    description:
      "A frameless input with its magnifier, running the palette's full " +
      "width over a hairline.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "prompt",
    label: "Prompt",
    description:
      "Like Bar but text only: no magnifier, and the placeholder lines up " +
      "with the item labels.",
  },
]

export const SCALE_OPTIONS = [
  {
    value: "default",
    label: "Default",
    description: "Palette rows and input at dropdown-menu size.",
  },
  {
    value: "large",
    label: "Large",
    description:
      "A 44px input with base-size text, taller rows and 20px icons — a " +
      "hero surface.",
    seenIn: ["shadcn/ui"],
    caution:
      "Command palette only: menus and Select and ComboBox lists keep their " +
      "density size.",
  },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveMenus(state: StudioState): Resolved {
  const list = {
    indicator: pick(INDICATOR_OPTIONS, state.menuIndicator, "check-end"),
    highlight: pick(HIGHLIGHT_OPTIONS, state.menuHighlight, "neutral"),
    inset: pick(INSET_OPTIONS, state.menuInset, "inset"),
    labels: pick(LABEL_OPTIONS, state.menuLabels, "sentence"),
  }
  return {
    params: {
      menu: list,
      "list-box": list,
      command: {
        search: pick(SEARCH_OPTIONS, state.menuSearch, "field"),
        inset: list.inset,
        scale: pick(SCALE_OPTIONS, state.menuScale, "default"),
      },
    },
  }
}

export const MENU_SPEC = {
  label: "Menus",
  description:
    "One language for every floating list — menus, Select and ComboBox " +
    "listboxes, and the command palette — plus the palette's own search " +
    "chrome and scale.",
  axes: {
    menuIndicator: {
      label: "Indicator",
      description:
        "Where the check of a selected item sits, in menus and listboxes " +
        "alike.",
      value: { type: "enum", options: INDICATOR_OPTIONS },
      guidance:
        "Leading is the majority (7 of 11 checked). Several systems split " +
        "by component — shadcn/ui and React Aria's starter lead in menus " +
        "and trail in select lists — which this axis unifies. Trailing " +
        "keeps labels flush-left and suits single-select pickers.",
    },
    menuHighlight: {
      label: "Highlight",
      description:
        "How the keyboard-focused or hovered item is painted: a neutral " +
        "wash or a solid accent bar with inverted text.",
      value: { type: "enum", options: HIGHLIGHT_OPTIONS },
      guidance:
        "Neutral is the default in 7 of 9 checked systems; Accent is the " +
        "native desktop look (Radix Themes' default, Chakra's solid " +
        "variant, React Aria's starter). Accent is loud on long lists, " +
        "neutral can vanish on tinted surfaces.",
    },
    menuInset: {
      label: "Items",
      description:
        "Whether items float as rounded chips inside a padded list or run " +
        "edge to edge.",
      value: { type: "enum", options: INSET_OPTIONS },
      guidance:
        "Inset is the Tailwind-era default (5 of 7 checked); Full bleed is " +
        "Material 3's and Carbon's, and pairs with Square shapes and " +
        "divided lists.",
    },
    menuLabels: {
      label: "Labels",
      description: "The casing of section headers in menus and listboxes.",
      value: { type: "enum", options: LABEL_OPTIONS },
      guidance:
        "All 9 checked systems write section headers as-is in small or muted " +
        "text; Geist asks for Title Case, and Atlassian has dropped its " +
        "uppercase headings. Caps reads as a dense, technical tool.",
    },
    menuSearch: {
      label: "Command palette search",
      description:
        "The command palette's search chrome: a boxed field, a full-width " +
        "bar, or a bare prompt.",
      value: { type: "enum", options: SEARCH_OPTIONS },
      guidance:
        "shadcn/ui ships both: a bar in its new-york style, a boxed field " +
        "in nova; React Aria's starter boxes it. Bar and Prompt read as a " +
        "spotlight surface, Field as a searchable menu.",
    },
    menuScale: {
      label: "Command palette scale",
      description:
        "Command palette only: whether the Command component (in a " +
        "popover, dialog or drawer) is sized like a dropdown menu or steps " +
        "up to a hero surface. Menus and Select and ComboBox listboxes " +
        "keep their density size.",
      value: { type: "enum", options: SCALE_OPTIONS },
      guidance:
        "shadcn/ui's CommandDialog steps its input to 48px and its rows " +
        "and icons up. Large fits a global ⌘K palette; keep Default when " +
        "the palette mostly lives in popovers.",
    },
  },
} satisfies ChapterSpec<typeof MENU_DEFAULTS>
