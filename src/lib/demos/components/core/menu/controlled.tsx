"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import { Menu, MenuItem, MenuRoot } from "@/lib/components/core/default/menu";

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className="flex items-center gap-4">
      <MenuRoot isOpen={isOpen} onOpenChange={setOpen}>
        <Button>Settings</Button>
        <Menu>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Command menu</MenuItem>
        </Menu>
      </MenuRoot>
      <p className="text-sm text-fg-muted">state: {isOpen ? "open" : "closed"}</p>
    </div>
  );
}
