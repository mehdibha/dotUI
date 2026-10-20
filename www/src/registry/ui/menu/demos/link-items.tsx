import { CodeIcon, FileTextIcon, MessageSquareIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"

export default function Demo() {
  return (
    <Menu>
      <Button variant="secondary" size="sm">
        Resources
      </Button>
      <Popover>
        <MenuContent>
          <MenuItem href="https://dotui.org/docs" target="_blank">
            <FileTextIcon />
            Documentation
          </MenuItem>
          <MenuItem href="https://github.com/mehdibha/dotUI" target="_blank">
            <CodeIcon />
            GitHub
          </MenuItem>
          <MenuItem
            href="https://discord.com/invite/DXpj5V2fU8"
            target="_blank"
          >
            <MessageSquareIcon />
            Discord
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
