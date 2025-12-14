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
import { Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Overlay } from "@dotui/registry/ui/overlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";

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
          <Button variant="default">
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
        <Select value={placement} onChange={setPlacement}>
          <Label>Placement</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="top">Top</SelectItem>
            <SelectItem id="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
        <NumberField value={offset} onChange={setOffset}>
          <Label>Offset</Label>
          <Group>
            <Input />
            <Button slot="decrement" />
            <Button slot="increment" />
          </Group>
        </NumberField>
        <NumberField value={crossOffset} onChange={setCrossOffset}>
          <Label>Cross offset</Label>
          <Group>
            <Input />
            <Button slot="decrement" />
            <Button slot="increment" />
          </Group>
        </NumberField>
        <NumberField value={containerPadding} onChange={setContainerPadding}>
          <Label>Container padding</Label>
          <Group>
            <Input />
            <Button slot="decrement" />
            <Button slot="increment" />
          </Group>
        </NumberField>
        <Switch isSelected={showArrow} onChange={setShowArrow}>
          <SwitchIndicator />
          <Label>Arrow</Label>
        </Switch>
      </div>
    </div>
  );
}
