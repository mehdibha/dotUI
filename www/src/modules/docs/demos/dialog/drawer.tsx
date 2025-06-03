"use client";

import type { Key } from "react-aria-components";
import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { Dialog, DialogRoot } from "@/components/dynamic-ui/dialog";
import { Select, SelectItem } from "@/components/dynamic-ui/select";
import { Switch } from "@/components/dynamic-ui/switch";

export default function Demo() {
  const [placement, setPlacement] = React.useState<Key | null>("top");
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
          <SelectItem id="top">Top</SelectItem>
          <SelectItem id="bottom">Bottom</SelectItem>
        </Select>
        <Switch isSelected={swipeable} onChange={setSwipeable}>
          Swipeable
        </Switch>
      </div>
    </div>
  );
}
