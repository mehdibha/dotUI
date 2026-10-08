import { CONTAINER_VALUES, MARKER_VALUES } from "./accordion"
import { options } from "./core/meta"

export const CONTAINER_OPTIONS = options(CONTAINER_VALUES, {
  divided: {
    label: "Divided",
    credits: [
      "shadcn nova, vega, lyra, sera",
      "Geist",
      "Carbon",
      "Chakra (outline)",
      "Mantine",
      "Spectrum 2",
    ],
  },
  contained: {
    label: "Contained",
    credits: [
      "shadcn mira, rhea, luma, maia",
      "Ant Design",
      "Chakra (enclosed)",
      "Mantine (contained)",
    ],
  },
  separated: { label: "Separated", credits: ["HeroUI (splitted)"] },
  plain: { label: "Plain", credits: ["Notion", "Fluent 2", "Chakra (plain)"] },
})

export const MARKER_OPTIONS = options(MARKER_VALUES, {
  "trailing-chevron": {
    label: "Trailing chevron",
    credits: ["shadcn", "Mantine", "Chakra", "MUI", "Carbon"],
  },
  "leading-caret": {
    label: "Leading caret",
    credits: [
      "Notion",
      "Linear",
      "Stripe",
      "Fluent 2",
      "Spectrum 2",
      "Ant Design",
      "Apple HIG",
    ],
  },
})

export const OPTIONS = {
  accordionContainer: CONTAINER_OPTIONS,
  accordionMarker: MARKER_OPTIONS,
}
