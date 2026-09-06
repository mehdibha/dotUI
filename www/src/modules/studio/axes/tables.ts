/* Tables — how a data grid separates its rows, and how loud its header row
   is. Two axes because real systems mix them freely.

   Engine: `separation` and `header` are enum params on `table`. */

import type { Resolved, StudioState } from "./index"

export const TABLE_DEFAULTS = {
  tableSeparation: "lines",
  tableHeader: "plain",
}

/* Hairlines under every row is the modern default (shadcn, GitHub, Radix
   Themes); zebra striping survives in dense data tools and classic
   Bootstrap; plain drops both — the Linear list look. */
export const SEPARATION_OPTIONS = [
  { value: "lines", label: "Lines" },
  { value: "striped", label: "Striped" },
  { value: "plain", label: "Plain" },
]

/* shadcn leaves the header a bare muted-text line over the data; Ant and
   Carbon paint a filled band (their gray-2 / layer-accent). */
export const HEADER_OPTIONS = [
  { value: "plain", label: "Plain" },
  { value: "filled", label: "Filled" },
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
