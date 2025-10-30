"use client";

import React from "react";
import type { Key } from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Select, SelectItem } from "@dotui/registry/ui/select";
import { Switch } from "@dotui/registry/ui/switch";

export default function Demo() {
  const [placement, setPlacement] = React.useState<Key | null>("top");
  const [swipeable, setSwipeable] = React.useState<boolean>(true);
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center justify-center">
        <Dialog>
          <Button variant="default">Open drawer</Button>
          <Overlay type="drawer">
            <DialogContent>
              <DialogHeader>
                <DialogHeading>Help</DialogHeading>
                <DialogDescription>
                  For help accessing your account, please contact support.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Overlay>
        </Dialog>
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
