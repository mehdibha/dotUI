"use client";

import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  EllipsisIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
  MenuSub,
} from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Separator } from "@dotui/registry/ui/separator";
import { Avatar } from "@dotui/registry/ui/avatar";

export function MenuDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Menu>
        <Button>Open Menu</Button>
        <Overlay type="popover">
          <MenuContent>
            <MenuSection>
              <MenuSectionHeader>Account</MenuSectionHeader>
              <MenuItem>
                Profile
                <Kbd>⇧⌘P</Kbd>
              </MenuItem>
              <MenuItem>
                Billing
                <Kbd>⌘B</Kbd>
              </MenuItem>
              <MenuItem>
                Settings
                <Kbd>⌘S</Kbd>
              </MenuItem>
              <MenuItem>
                Keyboard shortcuts
                <Kbd>⌘K</Kbd>
              </MenuItem>
            </MenuSection>
            <Separator />
            <MenuSection>
              <MenuItem>Team</MenuItem>
              <MenuSub>
                <MenuItem>Invite users</MenuItem>
                <Overlay type="popover">
                  <MenuContent>
                    <MenuItem>Email</MenuItem>
                    <MenuItem>Message</MenuItem>
                  </MenuContent>
                </Overlay>
              </MenuSub>
              <MenuItem>
                New Team
                <Kbd>⌘+T</Kbd>
              </MenuItem>
            </MenuSection>
            <Separator />
            <MenuItem>GitHub</MenuItem>
            <MenuItem>Support</MenuItem>
            <MenuItem isDisabled>API</MenuItem>
            <Separator />
            <MenuItem>
              Log out
              <Kbd>⇧⌘Q</Kbd>
            </MenuItem>
          </MenuContent>
        </Overlay>
      </Menu>

      <Menu>
        <Button>Multiple Selection</Button>
        <Overlay type="popover">
          <MenuContent selectionMode="multiple">
            <MenuSection>
              <MenuSectionHeader>Appearance</MenuSectionHeader>
              <MenuItem>Status Bar</MenuItem>
              <MenuItem isDisabled>Activity Bar</MenuItem>
              <MenuItem>Panel</MenuItem>
            </MenuSection>
          </MenuContent>
        </Overlay>
      </Menu>

      <Menu>
        <Button>Single Selection</Button>
        <Overlay type="popover">
          <MenuContent selectionMode="single">
            <MenuSection>
              <MenuSectionHeader>Appearance</MenuSectionHeader>
              <MenuItem>Status Bar</MenuItem>
              <MenuItem isDisabled>Activity Bar</MenuItem>
              <MenuItem>Panel</MenuItem>
            </MenuSection>
          </MenuContent>
        </Overlay>
      </Menu>

      <Menu>
        <Button className="h-12 justify-start px-2 md:max-w-[230px]">
          <Avatar
            src="https://github.com/mehdibha.png"
            alt="mehdibha"
            fallback="M"
            className="size-7"
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">mehdibha</span>
            <span className="text-muted-foreground truncate text-xs">
              mehdibha@example.com
            </span>
          </div>
          <ChevronsUpDownIcon className="text-muted-foreground ml-auto" />
        </Button>
        <Overlay type="popover">
          <div className="flex items-center gap-2 px-4 py-2 text-left text-sm">
            <Avatar
              src="https://github.com/mehdibha.png"
              alt="mehdibha"
              fallback="M"
              className="size-7"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">mehdibha</span>
              <span className="text-muted-foreground truncate text-xs">
                mehdibha@example.com
              </span>
            </div>
          </div>
          <Separator />
          <MenuContent className="min-w-56">
            <MenuItem>
              <SparklesIcon />
              Upgrade to Pro
            </MenuItem>
            <Separator />
            <MenuSection>
              <MenuItem>
                <BadgeCheckIcon />
                Account
              </MenuItem>
              <MenuItem>
                <CreditCardIcon />
                Billing
              </MenuItem>
              <MenuItem>
                <BellIcon />
                Notifications
              </MenuItem>
            </MenuSection>
            <Separator />
            <MenuItem>
              <LogOutIcon />
              Sign Out
            </MenuItem>
          </MenuContent>
        </Overlay>
      </Menu>

      <Menu>
        <Button variant="quiet">
          <EllipsisIcon />
        </Button>
        <Overlay type="popover">
          <MenuContent>
            <MenuItem>New File</MenuItem>
            <MenuItem>Open File</MenuItem>
            <MenuItem>Save</MenuItem>
            <Separator />
            <MenuItem variant="danger">Delete</MenuItem>
          </MenuContent>
        </Overlay>
      </Menu>
    </div>
  );
}
