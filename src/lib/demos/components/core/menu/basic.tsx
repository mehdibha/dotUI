"use client";

import { Avatar } from "@/lib/components/core/default/avatar";
import { Button } from "@/lib/components/core/default/button";
import { Menu, MenuItem, MenuRoot, MenuSub } from "@/lib/components/core/default/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="ghost" shape="square">
        <Avatar src="https://github.com/mehdibha.png" fallback="M" className="size-7" />
      </Button>
      <Menu>
        <MenuItem>Account settings</MenuItem>
        <MenuItem>Create team</MenuItem>
        <MenuItem>Command menu</MenuItem>
        <MenuItem>Log out</MenuItem>
        <MenuSub>
          <MenuItem>Account settings</MenuItem>
          <Menu>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Command menu</MenuItem>
            <MenuItem>Log out</MenuItem>
          </Menu>
        </MenuSub>
      </Menu>
    </MenuRoot>
  );
}
