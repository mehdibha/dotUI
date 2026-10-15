"use client"

import { Button } from "@/registry/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  type MenuContentProps,
} from "@/registry/ui/menu"
import { Popover, type PopoverProps } from "@/registry/ui/popover"

export default function Demo({
  placement = "bottom",
  selectionMode = "none",
  destructive = true,
}: {
  placement?: PopoverProps["placement"]
  selectionMode?: MenuContentProps<object>["selectionMode"]
  destructive?: boolean
} = {}) {
  return (
    <Menu>
      <Button>Open Menu</Button>
      <Popover data-control-target placement={placement}>
        <MenuContent data-control-target selectionMode={selectionMode}>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Archive</MenuItem>
          {destructive && <MenuItem variant="danger">Delete</MenuItem>}
        </MenuContent>
      </Popover>
    </Menu>
  )
}
