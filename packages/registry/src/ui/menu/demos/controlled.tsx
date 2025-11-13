"use client";

import React from "react";

import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col-reverse items-center gap-4">
      <Menu isOpen={isOpen} onOpenChange={setOpen}>
        <Button>
          <MenuIcon />
        </Button>
        <Popover>
          <MenuContent>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
      <p className="text-fg-muted text-sm">
        state: {isOpen ? "open" : "closed"}
      </p>
    </div>
  );
}
