import { createDynamicComponent } from "@/lib/styles"

import { type PopoverProps, Popover as PlainPopover } from "./base"
import { Popover as TipPopover } from "./base.tip"

// The two files differ only in the `showArrow` default; the tip axis picks
// which one ships.
const Popover = createDynamicComponent<PopoverProps, "none" | "tip">({
  componentName: "popover",
  paramName: "tip",
  defaultValue: "none",
  components: {
    none: PlainPopover,
    tip: TipPopover,
  },
  displayName: "Popover",
})

export type { PopoverProps }
export { Popover }
