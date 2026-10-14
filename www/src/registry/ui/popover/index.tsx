import { createDynamicComponent } from "@/lib/styles"

import { type PopoverProps, Popover as PlainPopover } from "./base.popover"
import { Popover as SheetPopover } from "./base.sheet"

const Popover = createDynamicComponent<PopoverProps, "sheet" | "popover">({
  componentName: "popover",
  paramName: "mobile",
  defaultValue: "sheet",
  components: {
    sheet: SheetPopover,
    popover: PlainPopover,
  },
  displayName: "Popover",
})

export type { PopoverProps }
export { Popover }
