"use client";

import React from "react";
import { InfoIcon } from "lucide-react";
import type { Key } from "react-aria-components";
import { Button } from "@/components/dynamic-ui/button";
import { DialogRoot, Dialog } from "@/components/dynamic-ui/dialog";
import { NumberField } from "@/components/dynamic-ui/number-field";
import { Select, SelectItem } from "@/components/dynamic-ui/select";
import { Switch } from "@/components/dynamic-ui/switch";

export default function Demo() {
  const [placement, setPlacement] = React.useState<Key | null>("top");
  const [offset, setOffset] = React.useState<number>(0);
  const [crossOffset, setCrossOffset] = React.useState<number>(0);
  const [containerPadding, setContainerPadding] = React.useState<number>(0);
  const [showArrow, setShowArrow] = React.useState<boolean>(true);
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center justify-center">
        <DialogRoot>
          <Button variant="outline" shape="square">
            <InfoIcon />
          </Button>
          <Dialog
            type="popover"
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
