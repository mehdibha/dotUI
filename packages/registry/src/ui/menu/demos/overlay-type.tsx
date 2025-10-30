"use client";

import React from "react";

import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";
import type { OverlayProps } from "@dotui/registry/ui/overlay";

export default function Demo() {
  const [type, setType] = React.useState("popover");
  const [mobileType, setMobileType] = React.useState("drawer");
  return (
    <div className="flex items-center gap-14">
      <Menu>
        <Button variant="default" aspect="square">
          <MenuIcon />
        </Button>
        <Overlay
          type={type as OverlayProps["type"]}
          mobileType={mobileType as OverlayProps["type"]}
        >
          <MenuContent>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Command menu</MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuContent>
        </Overlay>
      </Menu>
      <div className="flex items-center gap-6">
        <RadioGroup value={type} onChange={setType}>
          <Label>Type</Label>
          <FieldGroup>
            <Radio value="popover">Popover</Radio>
            <Radio value="modal">Modal</Radio>
            <Radio value="drawer">Drawer</Radio>
          </FieldGroup>
        </RadioGroup>
        <RadioGroup value={mobileType} onChange={setMobileType}>
          <Label>MobileType</Label>
          <FieldGroup>
            <Radio value="popover">Popover</Radio>
            <Radio value="modal">Modal</Radio>
            <Radio value="drawer">Drawer</Radio>
          </FieldGroup>
        </RadioGroup>
      </div>
    </div>
  );
}
