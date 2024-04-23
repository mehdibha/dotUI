"use client";

import { Checkbox } from "@/lib/components/core/default/checkbox";

export default function CheckboxIndeterminateDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" checked="indeterminate" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled"
      >
        Select all
      </label>
    </div>
  );
}
