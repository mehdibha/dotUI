"use client";

import React from "react";
import type { Key } from "react-aria-components";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Switch } from "@dotui/ui/components/switch";

export default function Demo() {
  const [placement, setPlacement] = React.useState<Key | null>("top");
  const [swipeable, setSwipeable] = React.useState<boolean>(true);
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center justify-center">
        <DialogRoot>
          <Button variant="default">Open drawer</Button>
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
