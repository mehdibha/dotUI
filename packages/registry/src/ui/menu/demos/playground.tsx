"use client";

import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

interface MenuPlaygroundProps {
  placement?: "bottom" | "top" | "left" | "right";
}

export function MenuPlayground({ placement = "bottom" }: MenuPlaygroundProps) {
  return (
    <Menu>
      <Button>Open Menu</Button>
      <Popover placement={placement}>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Archive</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  );
}
