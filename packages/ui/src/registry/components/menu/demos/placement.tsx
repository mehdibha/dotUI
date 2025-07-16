"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { MenuIcon } from "@dotui/ui/icons";

// TODO: finish example

export default function Demo() {
  const [placement, setPlacement] = React.useState("top");
  return (
    <div className="flex items-center gap-10">
      <MenuRoot>
        <Button variant="outline" shape="square" size="sm">
          <MenuIcon />
        </Button>
        <Menu>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Log out</MenuItem>
        </Menu>
      </MenuRoot>
      <Select
        label="Placement"
        selectedKey={placement}
        onSelectionChange={(key) => setPlacement(key as string)}
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
          <SelectItem key={index} id={pos.replace(" ", "")}>
            {pos}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
