// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { Label } from "@dotui/registry-v2/ui/field";
import { Select } from "@dotui/registry-v2/ui/select";

const items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Orange" },
  { id: 4, name: "Mango" },
  { id: 5, name: "Pineapple" },
];

export function SelectDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Select>
        <Label>Single selection</Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.List items={items}>
            {(item) => (
              <Select.Item id={item.id} textValue={item.name}>
                {item.name}
              </Select.Item>
            )}
          </Select.List>
        </Select.Popover>
      </Select>

      <Select selectionMode="multiple">
        <Label>Multiple selection</Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.List items={items}>
            {(item) => (
              <Select.Item id={item.id} textValue={item.name}>
                {item.name}
              </Select.Item>
            )}
          </Select.List>
        </Select.Popover>
      </Select>
    </div>
  );
}
