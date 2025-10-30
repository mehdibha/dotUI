"use client";

import React from "react";

import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";
import { Select, SelectContent, SelectItem } from "@dotui/registry/ui/select";

export default function Demo() {
  const [placement, setPlacement] = React.useState("top");
  return (
    <div className="flex items-center gap-10">
      <Menu>
        <Button variant="default" aspect="square" size="sm">
          <MenuIcon />
        </Button>
        <Popover placement={placement as any}>
          <MenuContent>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
      <Select
        defaultValue={placement}
        onChange={(key) => setPlacement(key as string)}
      >
        <Label>Placement</Label>
        <SelectContent items={placements}>
          {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
        </SelectContent>
      </Select>
    </div>
  );
}

const placements = [
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
  "left bottom",
  "start",
  "start top",
  "start bottom",
  "right",
  "right top",
  "right bottom",
  "end",
  "end top",
  "end bottom",
].map((pos) => ({ id: pos, label: pos }));
