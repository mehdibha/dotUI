import {
  ArchiveIcon,
  EllipsisIcon,
  PencilIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react'
import {
  Button,
  Kbd,
  Menu,
  MenuContent,
  MenuItem,
  Popover,
  Separator,
} from 'www'

export const Open = () => (
  <Menu defaultOpen>
    <Button isIconOnly aria-label="Open menu">
      <EllipsisIcon />
    </Button>
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

export const WithDestructive = () => (
  <Menu defaultOpen>
    <Button variant="default">Actions</Button>
    <Popover>
      <MenuContent>
        <MenuItem>
          <PencilIcon />
          Edit
          <Kbd>⌘E</Kbd>
        </MenuItem>
        <MenuItem>
          <ShareIcon />
          Share
        </MenuItem>
        <Separator />
        <MenuItem>
          <ArchiveIcon />
          Archive
        </MenuItem>
        <MenuItem variant="danger">
          <Trash2Icon />
          Delete
        </MenuItem>
      </MenuContent>
    </Popover>
  </Menu>
)
