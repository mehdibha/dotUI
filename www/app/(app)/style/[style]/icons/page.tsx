"use client";

import * as Lucide from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Label } from "@dotui/ui/components/field";
import { FormControl } from "@dotui/ui/components/form";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleForm } from "@/modules/styles/lib/form-context";

export default function IconographyPage() {
  return null;
  const { form } = useStyleForm();

  return (
    <div>
      <p className="mt-6 text-base font-semibold">Iconography</p>
      <FormControl
        name="icons.library"
        control={form.control}
        render={({ value, onChange, ...props }) => (
          <SelectRoot
            selectedKey={value}
            onSelectionChange={onChange}
            {...props}
            className="mt-2 w-full"
          >
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
              </ListBox>
            </Popover>
          </SelectRoot>
        )}
      />

      <FormControl
        name="icons.strokeWidth"
        control={form.control}
        render={(props) => (
          <Slider
            label="Stroke width"
            defaultValue={1.5}
            minValue={0.5}
            maxValue={3}
            step={0.1}
            getValueLabel={(value) => `${value}px`}
            className="mt-2 w-full"
            {...props}
          />
        )}
      />

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
