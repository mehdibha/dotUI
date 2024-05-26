"use client";

import React from "react";
import { ListBox } from "react-aria-components";
import { Button } from "@/lib/components/core/default/button";
import { Overlay } from "@/lib/components/core/default/overlay";
import { Select, SelectItem, SelectValue } from "@/lib/components/core/default/select";

export default function SelectDemo() {
  return (
    <div className="flex flex-col space-y-4">
      <Select>
        <Button>
          <SelectValue />
          <span aria-hidden="true">▼</span>
        </Button>
        <Overlay type="popover">
          <ListBox slot={null}>
            <SelectItem>Aardvark</SelectItem>
            <SelectItem>Cat</SelectItem>
            <SelectItem>Dog</SelectItem>
            <SelectItem>Kangaroo</SelectItem>
            <SelectItem>Panda</SelectItem>
            <SelectItem>Snake</SelectItem>
          </ListBox>
        </Overlay>
      </Select>
    </div>
  );
}
