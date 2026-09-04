import { MenuIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import { DemoState } from "../demo-state"
import { Surface } from "../overlay"

// An open menu: the trigger holds its pressed style and the first item is
// focused, as right after opening from the keyboard.
export function MenuDemo() {
  return (
    <DemoState
      states={{
        "[data-button]": ["data-pressed"],
        "[data-listbox-item]:first-of-type": [
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
        <Surface variant="menu" className="w-44 p-0">
          <ListBox
            aria-label="Menu"
            className="border-0 bg-transparent shadow-none"
          >
            <ListBoxItem id="account">Account settings</ListBoxItem>
            <ListBoxItem id="team">Create team</ListBoxItem>
            <ListBoxItem id="logout">Log out</ListBoxItem>
          </ListBox>
        </Surface>
      </div>
    </DemoState>
  )
}
