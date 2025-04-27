import React from "react";
import { NumberField } from "@/components/dynamic-core/number-field";

export function NumberFieldDemo() {
  return (
    <div className="flex gap-4">
      <NumberField label="Default" />
      <NumberField
        label="With limits"
        minValue={0}
        maxValue={100}
        defaultValue={50}
      />
      <NumberField label="Disabled" isDisabled />
    </div>
  );
}
