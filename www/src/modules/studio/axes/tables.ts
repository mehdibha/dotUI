/* Tables — how loud the header row is: its band, and its labels' ink. Row
   rules are mechanics; striping is a table prop. Tree and standalone lists
   follow the table's selected rows (Color). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const TABLE_DEFAULTS = {
  tableHeader: "plain",
  tableHeaderLabel: "muted",
}

export const HEADER_OPTIONS = [
  {
    value: "plain",
    label: "Plain",
    credits: [
      "shadcn",
      "Geist",
      "Atlassian",
      "Fluent 2",
      "Catalyst",
      "Chakra (line)",
      "Mantine",
      "Radix Themes (ghost)",
    ],
  },
  {
    value: "filled",
    label: "Filled",
    credits: [
      "Polaris",
      "Primer",
      "Carbon",
      "Ant Design",
      "Untitled UI",
      "HeroUI",
    ],
  },
]

export const HEADER_LABEL_OPTIONS = [
  {
    value: "strong",
    label: "Strong",
    credits: ["shadcn", "Carbon", "Ant Design", "Radix Themes", "Stripe"],
  },
  {
    value: "muted",
    label: "Muted",
    credits: ["Primer", "Polaris", "shadcn sera", "Material 3", "Notion"],
  },
]

export const TABLE_SCHEMA: ChapterSchema<typeof TABLE_DEFAULTS> = {
  tableHeader: oneOf(HEADER_OPTIONS),
  tableHeaderLabel: oneOf(HEADER_LABEL_OPTIONS),
}

export function resolveTables(state: Effective): Resolved {
  return {
    params: {
      table: {
        header: state.tableHeader,
        headerLabel: state.tableHeaderLabel,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "tables",
  defaults: TABLE_DEFAULTS,
  schema: TABLE_SCHEMA,
  resolve: resolveTables,
})
