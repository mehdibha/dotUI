"use client";

import React from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Radio, RadioGroup } from "@dotui/ui/components/radio-group";
import type { OverlayProps } from "@dotui/ui/components/overlay";

export default function Demo() {
  const [type, setType] = React.useState("popover");
  const [mobileType, setMobileType] = React.useState("drawer");
  return (
    <div className="flex items-center gap-14">
      <MenuRoot>
        <Button variant="outline" shape="square">
          <MenuIcon />
        </Button>
        <Menu
          type={type as OverlayProps["type"]}
          mobileType={mobileType as OverlayProps["type"]}
        >
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Command menu</MenuItem>
          <MenuItem>Log out</MenuItem>
        </Menu>
      </MenuRoot>
      <div className="flex items-center gap-6">
        <RadioGroup label="Type" value={type} onChange={setType}>
          <Radio value="popover">Popover</Radio>
          <Radio value="modal">Modal</Radio>
          <Radio value="drawer">Drawer</Radio>
        </RadioGroup>
        <RadioGroup
          label="MobileType"
          value={mobileType}
          onChange={setMobileType}
        >
          <Radio value="popover">Popover</Radio>
          <Radio value="modal">Modal</Radio>
          <Radio value="drawer">Drawer</Radio>
        </RadioGroup>
      </div>
    </div>
  );
}
