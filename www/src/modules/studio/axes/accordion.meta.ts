import { CONTAINER_VALUES, MARKER_VALUES } from "./accordion"
import { options } from "./core/meta"

export const CONTAINER_OPTIONS = options(CONTAINER_VALUES, {
  divided: {
    label: "Divided",
    description: "Hairlines between the rows",
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
    description: "All items in one box, open one shaded",
    credits: [
      "shadcn mira, rhea, luma, maia",
      "Ant Design",
      "Chakra (enclosed)",
      "Mantine (contained)",
    ],
  },
  separated: {
    label: "Separated",
    description: "Each item in its own box",
    credits: ["HeroUI (splitted)"],
  },
  plain: {
    label: "Plain",
    description: "No lines or boxes",
    credits: ["Notion", "Fluent 2", "Chakra (plain)"],
  },
})

export const MARKER_OPTIONS = options(MARKER_VALUES, {
  "trailing-chevron": {
    label: "Trailing chevron",
    description: "A chevron at the end that flips open",
    credits: ["shadcn", "Mantine", "Chakra", "MUI", "Carbon"],
  },
  "leading-caret": {
    label: "Leading caret",
    description: "A caret before the title that turns open",
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
