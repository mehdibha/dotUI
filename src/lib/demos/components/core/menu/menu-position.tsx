"use client";

import React from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Label } from "@/lib/components/core/default/label";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/lib/components/core/default/menu";
import { RadioGroup, RadioGroupItem } from "@/lib/components/core/default/radio-group";

type Side = Exclude<React.ComponentProps<typeof MenuContent>["side"], undefined>;
type Align = Exclude<React.ComponentProps<typeof MenuContent>["align"], undefined>;

export default function MenuDemo() {
  const [side, setSide] = React.useState<Side>("bottom");
  const [align, setAlign] = React.useState<Align>("end");
  return (
    <div className="flex items-center gap-16">
      <MenuRoot>
        <MenuTrigger asChild>
          <Button shape="square" variant="ghost" aria-label="menu">
            <MenuIcon />
          </Button>
        </MenuTrigger>
        <MenuContent align={align} side={side}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuContent>
      </MenuRoot>
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label>Side</Label>
          <RadioGroup value={side} onValueChange={(newVal: Side) => setSide(newVal)}>
            <RadioGroupItem value="top">Top</RadioGroupItem>
            <RadioGroupItem value="bottom">Bottom</RadioGroupItem>
            <RadioGroupItem value="right">Right</RadioGroupItem>
            <RadioGroupItem value="left">Left</RadioGroupItem>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Align</Label>
          <RadioGroup value={align} onValueChange={(newVal: Align) => setAlign(newVal)}>
            <RadioGroupItem value="start">Start</RadioGroupItem>
            <RadioGroupItem value="center">Center</RadioGroupItem>
            <RadioGroupItem value="end">End</RadioGroupItem>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
