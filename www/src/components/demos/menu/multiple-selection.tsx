import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" size="sm">
        Panels
      </Button>
      <Menu
        selectionMode="multiple"
        defaultSelectedKeys={["sidebar", "searchbar", "console"]}
      >
        <MenuItem id="sidebar">Sidebar</MenuItem>
        <MenuItem id="searchbar">Searchbar</MenuItem>
        <MenuItem id="tools">Tools</MenuItem>
        <MenuItem id="console">Console</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
