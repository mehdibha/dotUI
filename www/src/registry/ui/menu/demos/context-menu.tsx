import { Pressable } from "react-aria-components/Pressable"

import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"

export default function Demo() {
  return (
    <Menu trigger="contextMenu">
      <Pressable>
        <div
          role="button"
          tabIndex={0}
          className="bg-bg-muted flex h-32 w-64 items-center justify-center rounded-md border border-dashed text-sm text-fg-muted"
        >
          Right click me
        </div>
      </Pressable>
      <Popover>
        <MenuContent>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Command menu</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
