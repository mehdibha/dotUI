"use client";

import type { Control } from "@dotui/registry/playground";
import { Button } from "@dotui/registry/ui/button";
import { Popover } from "@dotui/registry/ui/popover";

import { Menu, MenuContent, MenuItem } from "../index";

interface MenuPlaygroundProps {
  placement?: "bottom" | "top" | "left" | "right";
}

export function MenuPlayground({
  placement = "bottom",
}: MenuPlaygroundProps) {
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

export const menuControls: Control[] = [
  {
    type: "enum",
    name: "placement",
    label: "Placement",
    options: ["bottom", "top", "left", "right"],
    defaultValue: "bottom",
  },
];

