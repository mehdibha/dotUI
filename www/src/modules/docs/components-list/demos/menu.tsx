import { MenuIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { MenuContent, MenuItem } from "@/registry/ui/menu"

import { DemoState } from "../demo-state"
import { Surface } from "../overlay"

// An open menu: the trigger holds its pressed style and the first item is
// focused, as right after opening from the keyboard.
export function MenuDemo() {
  return (
    <DemoState
      states={{
        "[data-button]": ["data-pressed"],
        "[data-menu-item]:first-of-type": [
          "data-hovered",
          "data-focused",
          "data-focus-visible",
        ],
      }}
    >
      <div className="flex flex-col items-start gap-2">
        <Button aria-label="Menu" isIconOnly>
          <MenuIcon />
        </Button>
        <Surface variant="menu" className="w-44">
          <MenuContent aria-label="Menu">
            <MenuItem id="account">Account settings</MenuItem>
            <MenuItem id="team">Create team</MenuItem>
            <MenuItem id="logout">Log out</MenuItem>
          </MenuContent>
        </Surface>
      </div>
    </DemoState>
  )
}
