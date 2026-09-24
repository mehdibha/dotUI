/* Tables — how a data grid separates its rows, and how loud its header row
   is. Two axes because real systems mix them freely.

   Engine: `separation` and `header` are enum params on `table`. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const TABLE_DEFAULTS = {
  tableSeparation: "lines",
  tableHeader: "plain",
}

export const SEPARATION_OPTIONS = [
  {
    value: "lines",
    label: "Lines",
    description: "A hairline under every row but the last.",
    seenIn: ["shadcn/ui", "Radix Themes", "Carbon", "Ant Design", "Mantine"],
  },
  {
    value: "striped",
    label: "Striped",
    description:
      "No row lines; odd rows get a faint muted band (40% of the muted " +
      "fill).",
    seenIn: ["Carbon", "Mantine"],
  },
  {
    value: "plain",
    label: "Plain",
    description:
      "No lines and no bands; rows separate by spacing and hover alone.",
  },
]

export const HEADER_OPTIONS = [
  {
    value: "plain",
    label: "Plain",
    description:
      "Muted column labels on the page background, a hairline below; " +
      "when sticky, rows blur under a 95%-opaque header.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "filled",
    label: "Filled",
    description: "Column labels on an opaque band of the muted fill.",
    seenIn: ["Carbon", "Ant Design", "Radix Themes"],
  },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveTables(state: StudioState): Resolved {
  return {
    params: {
      table: {
        separation: pick(SEPARATION_OPTIONS, state.tableSeparation, "lines"),
        header: pick(HEADER_OPTIONS, state.tableHeader, "plain"),
      },
    },
  }
}

export const TABLE_SPEC = {
  label: "Tables",
  description:
    "How a data table separates its rows and how loud its header row is.",
  axes: {
    tableSeparation: {
      label: "Rows",
      description: "What divides one body row from the next.",
      value: { type: "enum", options: SEPARATION_OPTIONS },
      guidance:
        "Lines are the default in all 5 systems checked (shadcn, Radix " +
        "Themes, Carbon, Ant, Mantine); Carbon (`zebra`) and Mantine " +
        "(`striped`) offer striping as an option, and Mantine can drop row " +
        "borders. Stripe wide, dense numeric tables; go plain for short " +
        "list-like tables with generous row height.",
    },
    tableHeader: {
      label: "Header",
      description: "The header row's background.",
      value: { type: "enum", options: HEADER_OPTIONS },
      guidance:
        "Carbon and Ant fill the header band by default, Radix Themes in " +
        "its surface variant; shadcn leaves it bare. Filled anchors " +
        "enterprise data grids; plain suits tables that sit inside cards.",
    },
  },
} satisfies ChapterSpec<typeof TABLE_DEFAULTS>
