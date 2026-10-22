import { Pressable } from "react-aria-components/Pressable"

import {
  CopyIcon,
  ForwardIcon,
  PinIcon,
  ReplyIcon,
  Trash2Icon,
} from "@/registry/icons"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { Separator } from "@/registry/ui/separator"

export function ContextMenuScene() {
  return (
    <div className="flex w-full max-w-80 flex-col gap-2">
      <p className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-sm">
        Shipping the redesign Friday?
      </p>
      <Menu trigger="contextMenu">
        <Pressable>
          {/* No text selection or iOS callout: the hold belongs to the menu. */}
          <div
            role="button"
            tabIndex={0}
            className="max-w-[80%] cursor-default self-end rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-fg-on-primary outline-none select-none [-webkit-touch-callout:none] focus-visible:focus-ring"
          >
            Yes! Sheets and all. Hold this message.
          </div>
        </Pressable>
        <Popover>
          <MenuContent>
            <MenuItem>
              <ReplyIcon />
              Reply
            </MenuItem>
            <MenuItem>
              <ForwardIcon />
              Forward
            </MenuItem>
            <MenuItem>
              <CopyIcon />
              Copy text
            </MenuItem>
            <MenuItem>
              <PinIcon />
              Pin
            </MenuItem>
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
