import { createDynamicComponent, useComponentParams } from "@/lib/styles"

import { Popover as DrawerPopover } from "./base.drawer"
import { type PopoverProps, Popover as PlainPopover } from "./base.popover"
import meta from "./meta"

const DynamicPopover = createDynamicComponent({
  meta,
  paramName: "mobile",
  components: {
    drawer: DrawerPopover,
    anchored: PlainPopover,
  },
  displayName: "Popover",
})

const Popover = ({ showArrow, ...props }: PopoverProps) => {
  const { tip } = useComponentParams(meta.name)
  return <DynamicPopover showArrow={showArrow ?? tip === "tip"} {...props} />
}

export type { PopoverProps }
export { Popover }
