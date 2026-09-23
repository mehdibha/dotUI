/* Input groups — how a prefix/suffix sits in the field: floating inside the
   shell (shadcn, Radix Themes) or a tinted cell attached to the edge
   (Bootstrap input-group, Ant addonBefore/After). Bootstrap and Ant
   always divide the cell from the input; a few designs let the fill run into
   the field, so the hairline is a choice.

   Engine: one `input.addon` param — the divider only exists on a boxed cell,
   so the two rows fold into `inside | boxed | boxed-flush`. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./inputs"
import type { ChapterSpec } from "./spec"

export const INPUT_GROUP_DEFAULTS = {
  addonLayout: "inside",
  addonDivider: "hairline",
}

export const ADDON_LAYOUT_OPTIONS = [
  {
    value: "inside",
    label: "Inside",
    description:
      "Icons, text and buttons float inside the field's shell in muted " +
      "text, with no background of their own.",
    seenIn: ["shadcn/ui", "Radix Themes", "Mantine", "Fluent 2", "Primer"],
  },
  {
    value: "boxed",
    label: "Boxed",
    description:
      "The addon becomes a cell of highlight fill running the field's full " +
      "height at its start or end edge, sharing the outer corners.",
    seenIn: ["Ant Design", "Chakra UI"],
  },
]

export const ADDON_DIVIDER_OPTIONS = [
  {
    value: "hairline",
    label: "Hairline",
    description: "A 1px control-border line separates the cell from the input.",
    seenIn: ["Ant Design", "Chakra UI"],
  },
  {
    value: "none",
    label: "None",
    description: "The cell's fill meets the input with no line between.",
    seenIn: ["Chakra UI"],
  },
]

export function resolveInputGroups(state: StudioState): Resolved {
  const layout = pick(ADDON_LAYOUT_OPTIONS, state.addonLayout, "inside")
  const divider = pick(ADDON_DIVIDER_OPTIONS, state.addonDivider, "hairline")
  const addon =
    layout === "boxed"
      ? divider === "none"
        ? "boxed-flush"
        : "boxed"
      : "inside"
  return { params: { input: { addon } } }
}

export const INPUT_GROUP_SPEC = {
  label: "Input groups",
  description:
    "How a field's prefix and suffix — icons, units, URL schemes, inline " +
    "buttons — sit against the input.",
  axes: {
    addonLayout: {
      label: "Addons",
      description:
        "Whether addons float inside the shell or stand as a tinted cell on " +
        "the field's edge.",
      value: { type: "enum", options: ADDON_LAYOUT_OPTIONS },
      guidance:
        "Inside is the modern default (shadcn/ui, Radix Themes, Mantine, " +
        "Fluent 2, Primer). Boxed cells are Ant Design's addonBefore/After " +
        "and Chakra's InputAddon — pick them for admin and data-entry " +
        "products where units and prefixes should read as labels, not " +
        "decoration.",
    },
    addonDivider: {
      label: "Addon divider",
      description:
        "The line between a boxed cell and the input. Only visible when " +
        "Addons is Boxed.",
      value: { type: "enum", options: ADDON_DIVIDER_OPTIONS },
      guidance:
        "Ant Design and Chakra's outline addon keep the hairline; Chakra's " +
        "subtle variant drops it and lets the fills meet. Match the field: " +
        "Hairline with Outline, None with Filled.",
    },
  },
} satisfies ChapterSpec<typeof INPUT_GROUP_DEFAULTS>
