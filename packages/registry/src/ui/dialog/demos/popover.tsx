"use client";

import React from "react";
import type { Key } from "react-aria-components";

import { InfoIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Select, SelectItem } from "@dotui/registry/ui/select";
import { Switch } from "@dotui/registry/ui/switch";

export default function Demo() {
  const [placement, setPlacement] = React.useState<Key | null>("top");
  const [offset, setOffset] = React.useState<number>(0);
  const [crossOffset, setCrossOffset] = React.useState<number>(0);
  const [containerPadding, setContainerPadding] = React.useState<number>(0);
  const [showArrow, setShowArrow] = React.useState<boolean>(true);
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center justify-center">
        <Dialog>
          <Button variant="default" shape="square">
            <InfoIcon />
          </Button>
          <Overlay type="popover">
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
        <NumberField label="Offset" value={offset} onChange={setOffset} />
        <NumberField
          label="Cross offset"
          value={crossOffset}
          onChange={setCrossOffset}
        />
        <NumberField
          label="Container padding"
          value={containerPadding}
          onChange={setContainerPadding}
        />
        <Switch isSelected={showArrow} onChange={setShowArrow}>
          Arrow
        </Switch>
      </div>
    </div>
  );
}
