/* Popovers — the anchored panel's own decisions, past what Surfaces, Menus
   and Motion own. Tip: the arrow pointing at the trigger (Cloudscape, Ant,
   Bootstrap, Apple) vs the arrowless modern default (shadcn, Radix Themes,
   Linear). Header: a plain title (shadcn v4 PopoverHeader, Base UI) or a
   tinted divided band (Bootstrap popover-header, Ant title).

   Engine: `tip` is a files-enum on `popover` (which base file ships — the
   `showArrow` default flips); `header` is a `dialog` param whose band slice
   styles the title inside a popover. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const POPOVER_DEFAULTS = {
  popoverTip: "none",
  popoverHeader: "title",
}

export const TIP_OPTIONS = [
  { value: "none", label: "None" },
  { value: "tip", label: "Tip" },
]

export const HEADER_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "band", label: "Band" },
]

export const POPOVER_SCHEMA: ChapterSchema<typeof POPOVER_DEFAULTS> = {
  popoverTip: oneOf(TIP_OPTIONS),
  popoverHeader: oneOf(HEADER_OPTIONS),
}

export function resolvePopovers(state: StudioState): Resolved {
  return {
    params: {
      popover: { tip: state.popoverTip },
      dialog: { header: state.popoverHeader },
    },
  }
}
