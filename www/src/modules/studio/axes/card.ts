/* Card — what sets the header and footer apart. The container itself is
   Surfaces', the corners Shape's, the title Typography's. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const EDGE_VALUES = ["none", "rule", "band"] as const

export const chapter = defineChapter({
  id: "card",
  defaults: {
    cardHeader: "none",
    cardFooter: "none",
  },
  schema: {
    cardHeader: oneOf(EDGE_VALUES),
    cardFooter: oneOf(EDGE_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: { card: { header: state.cardHeader, footer: state.cardFooter } },
    }
  },
})
