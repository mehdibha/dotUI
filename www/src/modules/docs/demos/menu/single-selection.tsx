"use client";

import type { Selection } from "react-aria-components";
import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";

export default function Demo() {
  const [selected, setSelected] = React.useState<Selection>(
    new Set(["center"]),
  );
  return (
    <MenuRoot>
      <Button variant="outline" size="sm">
        Align
      </Button>
      <Menu
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <MenuItem id="start">Start</MenuItem>
        <MenuItem id="center">Center</MenuItem>
        <MenuItem id="end">End</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
