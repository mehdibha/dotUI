"use client";

import React from "react";
import type { Key } from "react-aria-components";
import { Button } from "@/components/dynamic-core/button";
import { DialogRoot, Dialog } from "@/components/dynamic-core/dialog";
import { Item } from "@/components/dynamic-core/list-box";
import { Select } from "@/components/dynamic-core/select";
import { Switch } from "@/components/dynamic-core/switch";

export default function Demo() {
  const [placement, setPlacement] = React.useState<Key>("top");
  const [swipeable, setSwipeable] = React.useState<boolean>(true);
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center justify-center">
        <DialogRoot>
          <Button variant="outline">Open drawer</Button>
          <Dialog
            type="drawer"
            title="Help"
            description="For help accessing your account, please contact support."
          />
        </DialogRoot>
      </div>
      <div className="space-y-4 rounded-md border p-4">
        <Select
          label="Placement"
          selectedKey={placement}
          onSelectionChange={setPlacement}
        >
          <Item id="top">Top</Item>
          <Item id="bottom">Bottom</Item>
        </Select>
        <Switch isSelected={swipeable} onChange={setSwipeable}>
          Swipeable
        </Switch>
      </div>
    </div>
  );
}
