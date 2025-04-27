import React from "react";
import { RadioGroup, Radio } from "@/components/dynamic-ui/radio-group";

export function RadioGroupDemo() {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup label="Favorite fruit">
        <Radio value="1">Apple</Radio>
        <Radio value="2">Banana</Radio>
        <Radio value="3">Orange</Radio>
        <Radio value="4" isDisabled>
          Grape
        </Radio>
      </RadioGroup>

      <RadioGroup orientation="horizontal" label="Size">
        <Radio value="sm">Small</Radio>
        <Radio value="md">Medium</Radio>
        <Radio value="lg">Large</Radio>
      </RadioGroup>
    </div>
  );
}
