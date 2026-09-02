import { MenuIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import { DemoState } from "../demo-state"
import { OverlayPreview } from "../overlay"

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
      <OverlayPreview
        variant="menu"
        align="start"
        surfaceClassName="w-44 p-0"
        trigger={
          <Button aria-label="Menu" isIconOnly>
            <MenuIcon />
          </Button>
        }
      >
        <ListBox
          aria-label="Menu"
          className="border-0 bg-transparent shadow-none"
        >
          <ListBoxItem id="account">Account settings</ListBoxItem>
          <ListBoxItem id="team">Create team</ListBoxItem>
          <ListBoxItem id="logout">Log out</ListBoxItem>
        </ListBox>
      </OverlayPreview>
    </DemoState>
  )
}
