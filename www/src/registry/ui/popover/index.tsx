import { createDynamicComponent } from "@/lib/styles"

import { Popover as DrawerPopover } from "./base.drawer"
import { type PopoverProps, Popover as PlainPopover } from "./base.popover"

const Popover = createDynamicComponent<PopoverProps, "drawer" | "popover">({
  componentName: "popover",
  paramName: "mobile",
  defaultValue: "drawer",
  components: {
    drawer: DrawerPopover,
    popover: PlainPopover,
  },
  displayName: "Popover",
})

export type { PopoverProps }
export { Popover }
