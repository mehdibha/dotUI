import {
  CopyIcon,
  FileTextIcon,
  FolderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ShareIcon,
  Trash2Icon,
} from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem, MenuSub } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { Separator } from "@/registry/ui/separator"

export function MenuScene() {
  return (
    <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border bg-card p-3 shadow-xs">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-danger-muted text-danger">
        <FileTextIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Brand guidelines.pdf</p>
        <p className="text-xs text-fg-muted">4.2 MB · Edited 2h ago</p>
      </div>
      <Menu>
        <Button variant="quiet" isIconOnly aria-label="File actions">
          <MoreHorizontalIcon />
        </Button>
        <Popover>
          <MenuContent>
            <MenuItem>
              <ShareIcon />
              Share
            </MenuItem>
            <MenuItem>
              <PencilIcon />
              Rename
            </MenuItem>
            <MenuItem>
              <CopyIcon />
              Duplicate
            </MenuItem>
            <MenuSub>
              <MenuItem>
                <FolderIcon />
                Move to
              </MenuItem>
              <Popover>
                <MenuContent>
                  <MenuItem>
                    <FolderIcon />
                    Design
                  </MenuItem>
                  <MenuItem>
                    <FolderIcon />
                    Marketing
                  </MenuItem>
                  <MenuItem>
                    <FolderIcon />
                    Archive
                  </MenuItem>
                </MenuContent>
              </Popover>
            </MenuSub>
            <Separator />
            <MenuItem variant="danger">
              <Trash2Icon />
              Delete
            </MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    </div>
  )
}
