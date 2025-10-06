"use client";

import { Select, SelectItem } from "@dotui/registry-v2/ui/select";

export default function InternalPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Select defaultValue="item-1">
        <SelectItem id="item-1">Item 1</SelectItem>
        <SelectItem id="item-2">Item 2</SelectItem>
        <SelectItem id="item-3">Item 3</SelectItem>
      </Select>
    </div>
  );
}
