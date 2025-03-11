"use client";

import React from "react";
import { Checkbox } from "@/components/dynamic-core/checkbox";

export function CheckboxDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Checkbox>Default checkbox</Checkbox>
      <Checkbox isDisabled>Disabled checkbox</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox appearance="card">Controlled checkbox</Checkbox>
    </div>
  );
}
