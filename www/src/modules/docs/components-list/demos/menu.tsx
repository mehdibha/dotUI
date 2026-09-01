import { MenuIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import { OverlayPreview } from "../overlay"

export function MenuDemo() {
  return (
    <OverlayPreview
      variant="menu"
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
  )
}
