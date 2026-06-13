import {
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from '@/registry/__generated__/icons'
import { ContextMenu } from '@/registry/ui/context-menu'
import { Kbd } from '@/registry/ui/kbd'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <ContextMenu className="bg-bg-muted flex h-32 w-64 items-center justify-center rounded-md border border-dashed text-sm text-fg-muted">
      Right click me
      <Popover className="w-52">
        <MenuContent>
          <MenuItem>
            <CopyIcon />
            Copy
            <Kbd className="ml-auto">⌘C</Kbd>
          </MenuItem>
          <MenuItem>
            <PencilIcon />
            Rename
            <Kbd className="ml-auto">⌘R</Kbd>
          </MenuItem>
          <Separator />
          <MenuItem>
            <StarIcon />
            Add to favorites
          </MenuItem>
          <MenuItem>
            <DownloadIcon />
            Download
          </MenuItem>
          <Separator />
          <MenuItem variant="danger">
            <TrashIcon />
            Delete
            <Kbd className="ml-auto">⌫</Kbd>
          </MenuItem>
        </MenuContent>
      </Popover>
    </ContextMenu>
  )
}
