/* Tables — how loud the header row is: its band, and its labels' ink. Row
   rules are mechanics; striping is a table prop. Tree and standalone lists
   follow the table's selected rows (Color). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const HEADER_VALUES = ["plain", "filled"] as const

export const HEADER_LABEL_VALUES = ["strong", "muted"] as const

export const chapter = defineChapter({
  id: "tables",
  defaults: {
    tableHeader: "plain",
    tableHeaderLabel: "muted",
  },
  schema: {
    tableHeader: oneOf(HEADER_VALUES),
    tableHeaderLabel: oneOf(HEADER_LABEL_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        table: {
          header: state.tableHeader,
          headerLabel: state.tableHeaderLabel,
        },
      },
    }
  },
})
