"use client";

import { Checkbox } from "@/lib/components/core/default/checkbox";

export default function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled"
      >
        I accept the{" "}
        <a href="#" className="text-fg-link underline underline-offset-2">
          terms and conditions
        </a>
      </label>
    </div>
  );
}
