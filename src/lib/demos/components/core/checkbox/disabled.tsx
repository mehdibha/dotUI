"use client";

import { Checkbox } from "@/lib/components/core/default/checkbox";

export default function CheckboxDisabledDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" disabled />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled"
      >
        I allow rcopy to collect usage data.
      </label>
    </div>
  );
}
