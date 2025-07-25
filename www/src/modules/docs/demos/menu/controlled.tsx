"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";
import { MenuIcon } from "lucide-react";

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col-reverse items-center gap-4">
      <MenuRoot isOpen={isOpen} onOpenChange={setOpen}>
        <Button variant="outline" shape="square">
          <MenuIcon />
        </Button>
        <Menu>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Log out</MenuItem>
        </Menu>
      </MenuRoot>
      <p className="text-fg-muted text-sm">
        state: {isOpen ? "open" : "closed"}
      </p>
    </div>
  );
}
