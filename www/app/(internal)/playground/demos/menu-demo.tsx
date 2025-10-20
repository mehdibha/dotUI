"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Menu, MenuItem } from "@dotui/registry-v2/ui/menu";
import { Separator } from "@dotui/registry-v2/ui/separator";

export function MenuDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Menu>
        <Button>Open Menu</Button>
        <Menu.Overlay>
          <Menu.Content>
            <MenuItem>New File</MenuItem>
            <MenuItem>Open File</MenuItem>
            <MenuItem>Save</MenuItem>
            <Separator />
            <MenuItem variant="danger">Delete</MenuItem>
          </Menu.Content>
        </Menu.Overlay>
      </Menu>
    </div>
  );
}
