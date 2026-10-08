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

export const HEADER_VALUES = ["plain", "filled"] as const

export const HEADER_LABEL_VALUES = ["strong", "muted"] as const

export const TABLE_SCHEMA: ChapterSchema<typeof TABLE_DEFAULTS> = {
  tableHeader: oneOf(HEADER_VALUES),
  tableHeaderLabel: oneOf(HEADER_LABEL_VALUES),
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
