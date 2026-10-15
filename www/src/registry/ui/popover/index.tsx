import { createDynamicComponent } from "@/lib/styles"

import { Popover as DrawerPopover } from "./base.drawer"
import { type PopoverProps, Popover as PlainPopover } from "./base.popover"
import meta from "./meta"

const Popover = createDynamicComponent({
  meta,
  paramName: "mobile",
  components: {
    drawer: DrawerPopover,
    anchored: PlainPopover,
  },
  displayName: "Popover",
})

export type { PopoverProps }
export { Popover }
