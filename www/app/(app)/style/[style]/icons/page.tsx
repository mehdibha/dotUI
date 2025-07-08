"use client";

import * as Lucide from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Label } from "@dotui/ui/components/field";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Slider } from "@dotui/ui/components/slider";

export default function IconographyPage() {
  console.log(
    Object.entries(Lucide)
      .filter(([name]) => name !== "index")
      .filter(([name]) => name.includes("Icon"))
      .map(([name]) => name)
      .slice(0, 100),
  );
  return (
    <div>
      <p className="text-base font-semibold">Iconography</p>
      <SelectRoot defaultSelectedKey="lucide" className="mt-2 w-full">
        <Label>Icon library</Label>
        <Button suffix={<Lucide.ChevronDownIcon />} className="w-full">
          <SelectValue />
        </Button>
        <Popover>
          <ListBox>
            <ListBoxItem id="lucide">lucide</ListBoxItem>
            <ListBoxItem id="heroicons">heroicons</ListBoxItem>
            <ListBoxItem id="phosphor">phosphor</ListBoxItem>
            <ListBoxItem id="tabler">tabler</ListBoxItem>
            <ListBoxItem id="radix">radix</ListBoxItem>
            <ListBoxItem id="geist">geist</ListBoxItem>
            <ListBoxItem id="geist">geist</ListBoxItem>
          </ListBox>
        </Popover>
      </SelectRoot>
      <Slider
        label="Stroke width"
        minValue={0.5}
        maxValue={3}
        step={0.1}
        getValueLabel={(value) => `${value}px`}
        className="mt-2 w-full"
      />
      <div className="mt-6"></div>
      <Label>Icons</Label>
      <div className="mt-2 rounded-md border bg-bg-muted/50 p-4">
        <div className="grid max-h-[168px] [grid-template-columns:repeat(auto-fill,minmax(36px,1fr))] [grid-template-rows:repeat(auto-fill,minmax(36px,1fr))] gap-2 overflow-hidden rounded-md [&_svg]:size-6">
          {Object.entries(Lucide)
            .filter(([name]) => name !== "index")
            .filter(([name]) => name.includes("Icon"))
            .slice(0, 100)
            .map(([name, Icon]) => {
              const IconComponent = Icon as React.ComponentType<any>;
              return (
                <div key={name} className="flex items-center justify-center">
                  <IconComponent />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
