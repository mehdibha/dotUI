import {
  CopyIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  ShareIcon,
  TrashIcon,
  UserIcon,
} from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Label } from "@/registry/ui/field"
import { Kbd } from "@/registry/ui/kbd"
import { ListBox } from "@/registry/ui/list-box"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { Select, SelectItem, SelectTrigger } from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import { Cell, Sheet } from "./layout"

/* Controlled `isOpen` without a setter keeps every overlay open; non-modal so
   neither makes the other inert and the highlighted item can take focus. The
   select composes SelectContent's own Popover + ListBox to pass `isNonModal`. */
export function MenuSheet() {
  return (
    <Sheet className="grid-cols-3 items-start">
      <Cell label="menu · sections, checks, shortcuts, danger, highlight">
        <Menu isOpen>
          <Button variant="secondary">Options</Button>
          <Popover isNonModal placement="bottom start" className="w-60">
            <MenuContent>
              <MenuSection>
                <MenuSectionHeader>Account</MenuSectionHeader>
                <MenuItem>
                  <UserIcon />
                  Profile
                  <Kbd className="ml-auto">⇧⌘P</Kbd>
                </MenuItem>
                <MenuItem data-specimen-focus="">
                  <CreditCardIcon />
                  Billing
                  <Kbd className="ml-auto">⌘B</Kbd>
                </MenuItem>
                <MenuItem>
                  <SettingsIcon />
                  Settings
                  <Kbd className="ml-auto">⌘,</Kbd>
                </MenuItem>
              </MenuSection>
              <Separator />
              <MenuSection
                selectionMode="multiple"
                defaultSelectedKeys={["toolbar", "status"]}
              >
                <MenuSectionHeader>View</MenuSectionHeader>
                <MenuItem id="toolbar">Toolbar</MenuItem>
                <MenuItem id="sidebar">Sidebar</MenuItem>
                <MenuItem id="status">Status bar</MenuItem>
              </MenuSection>
              <Separator />
              <MenuItem isDisabled>
                <ShareIcon />
                Share (disabled)
              </MenuItem>
              <MenuItem>
                <LogOutIcon />
                Sign out
              </MenuItem>
              <MenuItem variant="danger">
                <TrashIcon />
                Delete workspace
                <Kbd className="ml-auto">⌘⌫</Kbd>
              </MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
      </Cell>

      <Cell label="select · open listbox">
        <Select isOpen defaultValue="pro" className="w-56">
          <Label>Plan</Label>
          <SelectTrigger />
          <Popover isNonModal placement="bottom" className="overflow-hidden">
            <ListBox className="max-h-[inherit] overflow-auto">
              <SelectItem id="hobby">Hobby</SelectItem>
              <SelectItem id="pro">Pro</SelectItem>
              <SelectItem id="team">Team</SelectItem>
              <SelectItem id="enterprise">Enterprise</SelectItem>
              <SelectItem id="legacy" isDisabled>
                Legacy (disabled)
              </SelectItem>
            </ListBox>
          </Popover>
        </Select>
      </Cell>

      <Cell label="tooltip">
        <div className="pt-12 pl-16">
          <Tooltip isOpen>
            <Button variant="secondary" isIconOnly aria-label="Copy">
              <CopyIcon />
            </Button>
            <TooltipContent placement="top">Copy to clipboard</TooltipContent>
          </Tooltip>
        </div>
      </Cell>
    </Sheet>
  )
}
