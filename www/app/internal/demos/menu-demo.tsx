"use client";

import {
  CopyIcon,
  FileTextIcon,
  SaveIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  Menu,
  MenuItem,
  MenuRoot,
  MenuSection,
  MenuSub,
} from "@dotui/registry-v2/ui/menu";
import { Separator } from "@dotui/registry-v2/ui/separator";

export function MenuDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <MenuRoot>
        <Button>Open Menu</Button>
        <Menu>
          <MenuItem>New File</MenuItem>
          <MenuItem>Open File</MenuItem>
          <MenuItem>Save</MenuItem>
          <Separator />
          <MenuItem variant="danger">Delete</MenuItem>
        </Menu>
      </MenuRoot>

      <MenuRoot>
        <Button>With Icons</Button>
        <Menu>
          <MenuItem prefix={<FileTextIcon />}>New File</MenuItem>
          <MenuItem prefix={<SaveIcon />}>Save</MenuItem>
          <MenuItem prefix={<CopyIcon />}>Copy</MenuItem>
          <Separator />
          <MenuItem prefix={<TrashIcon />} variant="danger">
            Delete
          </MenuItem>
        </Menu>
      </MenuRoot>

      <MenuRoot>
        <Button>With Shortcuts</Button>
        <Menu>
          <MenuItem shortcut="⌘N">New</MenuItem>
          <MenuItem shortcut="⌘O">Open</MenuItem>
          <MenuItem shortcut="⌘S">Save</MenuItem>
          <Separator />
          <MenuItem shortcut="⌘Z">Undo</MenuItem>
          <MenuItem shortcut="⌘⇧Z">Redo</MenuItem>
        </Menu>
      </MenuRoot>

      <MenuRoot>
        <Button>With Sections</Button>
        <Menu>
          <MenuSection title="File">
            <MenuItem>New</MenuItem>
            <MenuItem>Open</MenuItem>
            <MenuItem>Save</MenuItem>
          </MenuSection>
          <MenuSection title="Edit">
            <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
          </MenuSection>
        </Menu>
      </MenuRoot>

      <MenuRoot>
        <Button>With Submenu</Button>
        <Menu>
          <MenuItem>New File</MenuItem>
          <MenuSub>
            <MenuItem>Open Recent</MenuItem>
            <Menu>
              <MenuItem>Document 1</MenuItem>
              <MenuItem>Document 2</MenuItem>
              <MenuItem>Document 3</MenuItem>
            </Menu>
          </MenuSub>
          <MenuItem>Save</MenuItem>
        </Menu>
      </MenuRoot>

      <MenuRoot>
        <Button>With Descriptions</Button>
        <Menu>
          <MenuItem
            label="Profile"
            description="View and edit your profile"
            prefix={<UserIcon />}
          />
          <MenuItem
            label="Settings"
            description="Manage your preferences"
            prefix={<SettingsIcon />}
          />
        </Menu>
      </MenuRoot>

      <MenuRoot>
        <Button>Selection Menu</Button>
        <Menu selectionMode="multiple">
          <MenuItem id="option1">Option 1</MenuItem>
          <MenuItem id="option2">Option 2</MenuItem>
          <MenuItem id="option3">Option 3</MenuItem>
        </Menu>
      </MenuRoot>
    </div>
  );
}
