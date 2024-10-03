"use client";

import React from "react";
import type { Key } from "react-aria-components";
import { InfoIcon } from "@/__icons__";
import { Button } from "@/registry/ui/default/core/button";
import { DialogRoot, Dialog } from "@/registry/ui/default/core/dialog";
import { Item } from "@/registry/ui/default/core/list-box";
import { NumberField } from "@/registry/ui/default/core/number-field";
import { Select } from "@/registry/ui/default/core/select";
import { Switch } from "@/registry/ui/default/core/switch";

export default function Demo() {
  const [placement, setPlacement] = React.useState<Key>("top");
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
          <Item id="top">Top</Item>
          <Item id="bottom">Bottom</Item>
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
