/* Buttons — the synced family's shared axes: Button sets the look, and the
   Button groups and Toggles sections reuse it. Style is a family look
   reshaping every fill variant at once; the variant enum stays API.

   Engine: `style`, `hover` and `press` are enum params on both `button` and
   `toggle-button` (a synced group — one axis writes both); radius rides on
   the shared `--studio-btn-radius` var. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"
import type { ChapterSpec } from "./spec"

export const BUTTON_DEFAULTS = {
  buttonStyle: "flat",
  buttonRadius: "auto",
  buttonHover: "dim",
  buttonPress: "dim",
}

export const STYLE_OPTIONS = [
  {
    value: "flat",
    label: "Flat",
    description: "Plain fills with no shadow; secondary keeps its hairline.",
    seenIn: ["shadcn/ui", "Geist", "Radix Themes"],
  },
  {
    value: "outline",
    label: "Outline",
    description:
      "Primary, warning and danger gain an inset 1px dark ring and a 1px " +
      "drop line under the bottom edge; secondary gains the drop line only.",
    seenIn: ["Primer"],
  },
  {
    value: "raised",
    label: "Raised",
    description:
      "A bevel on primary, warning and danger: a light-to-dark " +
      "top-to-bottom gradient, a 1px top highlight, a darker bottom rim and " +
      "a small drop shadow. Secondary gets a softer gradient, highlight and " +
      "drop shadow, with no rim.",
    seenIn: ["Radix Themes", "Polaris"],
  },
  {
    value: "elevated",
    label: "Elevated",
    description:
      "A soft two-layer drop shadow under every filled variant; secondary's " +
      "border turns transparent.",
    seenIn: ["Material 3"],
  },
]

export const RADIUS_OPTIONS = [
  {
    value: "auto",
    label: "Auto",
    description:
      "The Controls role from Shape, shared with inputs and selects.",
  },
  {
    value: "sharp",
    label: "Sharp",
    description: "Square corners.",
    seenIn: ["Carbon"],
  },
  {
    value: "round",
    label: "Round",
    description:
      "The lg rung — the base radius itself, rounder than inputs at the " +
      "Standard shape.",
  },
  {
    value: "pill",
    label: "Pill",
    description: "Fully rounded ends.",
    seenIn: ["Material 3"],
  },
]

export const HOVER_OPTIONS = [
  {
    value: "dim",
    label: "Dim",
    description:
      "The fill steps to its hover token: one ramp step deeper for an accent " +
      "or gray fill, 10% toward the page color for a near-black one.",
    seenIn: ["shadcn/ui", "Radix Themes", "Geist", "Carbon"],
  },
  {
    value: "lighten",
    label: "Lighten",
    description:
      "The fill brightens instead of moving along its ramp: 110% on " +
      "primary, warning and danger, 105% on secondary.",
    seenIn: ["Ant Design", "Material 3"],
  },
  {
    value: "none",
    label: "None",
    description:
      "Primary and secondary keep their resting fill; only quiet buttons " +
      "gain their hover wash.",
  },
]

export const PRESS_OPTIONS = [
  {
    value: "dim",
    label: "Dim",
    description:
      "The fill steps to its active token, one step past hover; quiet " +
      "buttons deepen their wash to 20%.",
    seenIn: ["Radix Themes", "Carbon", "Ant Design"],
  },
  {
    value: "scale",
    label: "Scale",
    description: "The button shrinks to 97% while held.",
    seenIn: ["HeroUI", "Spectrum 2"],
  },
  {
    value: "push",
    label: "Push",
    description: "The button moves 1px down while held.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "none",
    label: "None",
    description: "No press feedback; the hover state holds.",
    seenIn: ["Geist"],
  },
]

const RADIUS_TOKENS: Record<string, string> = {
  sharp: "0",
  round: "var(--radius-lg)",
  pill: "var(--radius-full)",
}

export function resolveButtons(state: StudioState): Resolved {
  const selection = {
    style: pick(STYLE_OPTIONS, state.buttonStyle, "flat"),
    hover: pick(HOVER_OPTIONS, state.buttonHover, "dim"),
    press: pick(PRESS_OPTIONS, state.buttonPress, "dim"),
  }
  const tokens: Record<string, string> = {}
  const radius = RADIUS_TOKENS[state.buttonRadius]
  if (radius) tokens["--studio-btn-radius"] = radius
  return {
    tokens,
    params: { button: selection, "toggle-button": selection },
  }
}

export const BUTTON_SPEC = {
  label: "Buttons",
  description:
    "The look of Button and Toggle Button together: a surface family, a " +
    "corner radius and the hover and press feedback. Variants (primary, " +
    "secondary, quiet, link, warning, danger) stay component API.",
  axes: {
    buttonStyle: {
      label: "Style",
      description:
        "The surface family of the filled buttons (primary, secondary, " +
        "warning, danger): shadows, bevel and border treatment. Warning and " +
        "danger take primary's treatment; quiet and link stay flat in every " +
        "family. Toggle Button has only primary, secondary and quiet.",
      value: { type: "enum", options: STYLE_OPTIONS },
      guidance:
        "Most systems ship flat buttons (shadcn/ui, Geist, Radix Themes' " +
        "solid variant). Raised is the skeuomorphic school — Radix Themes' " +
        "classic variant, Polaris' inset bevel. Primer's translucent border " +
        "plus resting shadow is Outline; Material 3's elevated button is " +
        "Elevated. Pick flat for dense tools, raised or elevated for a " +
        "tactile, consumer feel.",
    },
    buttonRadius: {
      label: "Radius",
      description:
        "Button corners, independent of Shape's Controls role unless left " +
        "on Auto.",
      value: { type: "enum", options: RADIUS_OPTIONS },
      guidance:
        "Keep Auto so buttons match the inputs beside them; Carbon's square " +
        "buttons (0 radius) are better reached through a square Shape. " +
        "Material 3 makes buttons pill-shaped by default (it also ships a " +
        "12dp square shape), the common case for overriding here.",
    },
    buttonHover: {
      label: "Hover",
      description:
        "How primary and secondary fills react under the pointer. Quiet " +
        "buttons gain a 10% wash under every option.",
      value: { type: "enum", options: HOVER_OPTIONS },
      guidance:
        "Of 6 checked, 4 step the fill to a hover state along its own " +
        "ramp (Radix Themes accent-10, Carbon's hover token, Geist's gray " +
        "on its black button, shadcn/ui's primary at 90%) and 2 brighten " +
        "it (Ant Design's lighter hover blue, Material 3's 8% white state " +
        "layer). None checked drops hover feedback entirely.",
    },
    buttonPress: {
      label: "Press",
      description: "The feedback while a button is held down.",
      value: { type: "enum", options: PRESS_OPTIONS },
      guidance:
        "Systems split four ways: a darker active fill (Radix Themes, " +
        "Carbon, Ant Design), a shrink (HeroUI scale 0.97, Spectrum 2's " +
        "perspective press), a 1px push (shadcn/ui's v4 styles) or nothing " +
        "(Geist). Scale and push read as physical; dim is the quietest " +
        "choice that still confirms the press.",
    },
  },
} satisfies ChapterSpec<typeof BUTTON_DEFAULTS>
