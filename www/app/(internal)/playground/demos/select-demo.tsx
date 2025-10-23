"use client";

import React from "react";
import {
  ChartBarIcon,
  ChartLineIcon,
  ChartPieIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  ListBoxItem,
} from "@dotui/registry-v2/ui/list-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectSectionHeader,
  SelectTrigger,
  SelectValue,
} from "@dotui/registry-v2/ui/select";

const _items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Orange" },
  { id: 4, name: "Mango" },
  { id: 5, name: "Pineapple" },
];

export function SelectDemo() {
  const items = React.useMemo(
    () =>
      Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        name: `Item ${index}`,
      })),
    [],
  );
  return (
    <div className="flex flex-wrap gap-6">
      <Select placeholder="Select a fruit">
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectSection>
            <SelectSectionHeader>Fruits</SelectSectionHeader>
            <SelectItem id="apple" textValue="apple">
              Apple
            </SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="blueberry">Blueberry</SelectItem>
            <SelectItem id="grapes" isDisabled>
              Grapes
            </SelectItem>
            <SelectItem id="pineapple">Pineapple</SelectItem>
          </SelectSection>
        </SelectContent>
      </Select>

      <Select placeholder="Virtualized List">
        <Button aspect="default">
          <SelectValue />
          <ChevronsUpDownIcon />
        </Button>
        <SelectContent items={items} virtulized>
          {(item) => <ListBoxItem key={item.id}>{item.name}</ListBoxItem>}
        </SelectContent>
      </Select>

      <Select placeholder="With icon">
        <SelectTrigger />
        <SelectContent>
          <SelectItem>
            <ChartLineIcon /> Line
          </SelectItem>
          <SelectItem>
            <ChartBarIcon />
            Bar
          </SelectItem>
          <SelectItem>
            <ChartPieIcon />
            Pie
          </SelectItem>
        </SelectContent>
      </Select>

      {/* <Select>
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
      </Select> */}
    </div>
  );
}
