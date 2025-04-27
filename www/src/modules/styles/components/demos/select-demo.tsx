import React from "react";
import { Select, SelectItem } from "@/components/ui/select";

export function SelectDemo() {
  return (
    <div className="flex gap-4">
      <Select label="Default select">
        <SelectItem id="1">Option 1</SelectItem>
        <SelectItem id="2">Option 2</SelectItem>
        <SelectItem id="3">Option 3</SelectItem>
      </Select>

      <Select label="Disabled select" isDisabled>
        <SelectItem id="1">Option 1</SelectItem>
        <SelectItem id="2">Option 2</SelectItem>
      </Select>
    </div>
  );
}
