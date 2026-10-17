/* Card — what sets the header and footer apart. The container itself is
   Surfaces', the corners Shape's, the title Typography's. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const FOOTER_VALUES = ["none", "rule", "band"] as const

export const HEADER_VALUES = FOOTER_VALUES

export const chapter = defineChapter({
  id: "card",
  defaults: {
    cardHeader: "none",
    cardFooter: "none",
  },
  schema: {
    cardHeader: oneOf(HEADER_VALUES),
    cardFooter: oneOf(FOOTER_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: { card: { header: state.cardHeader, footer: state.cardFooter } },
    }
  },
})
