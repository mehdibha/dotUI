"use client";

import React from "react";
import { MenuIcon } from "@/lib/icons";
import { Button } from "@/registry/ui/default/core/button";
import { Item } from "@/registry/ui/default/core/list-box";
import {
  Menu,
  MenuItem,
  MenuRoot,
  type MenuProps,
} from "@/registry/ui/default/core/menu";
import { Select } from "@/registry/ui/default/core/select";

type Placement = MenuProps<object>["placement"];

export default function Demo() {
  const [placement, setPlacement] = React.useState<Placement>("top");
  return (
    <div className="flex items-center gap-10">
      <MenuRoot>
        <Button variant="outline" shape="square" size="sm">
          <MenuIcon />
        </Button>
        <Menu placement={placement}>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Log out</MenuItem>
        </Menu>
      </MenuRoot>
      <Select
        label="Placement"
        selectedKey={placement}
        onSelectionChange={(key) => setPlacement(key as Placement)}
      >
        {[
          "bottom",
          "bottom left",
          "bottom right",
          "bottom start",
          "bottom end",
          "top",
          "top left",
          "top right",
          "top start",
          "top end",
          "left",
          "left top",
          "left",
          "bottom",
          "start",
          "start top",
          "start bottom",
          "right",
          "right top",
          "right",
          "bottom",
          "end",
          "end top",
          "end bottom",
        ].map((pos, index) => (
          <Item key={index} id={pos.replace(" ", "")}>
            {pos}
          </Item>
        ))}
      </Select>
    </div>
  );
}
