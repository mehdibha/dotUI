import React from "react";
import { RadioGroup, Radio } from "@/components/dynamic-core/radio-group";

export default function Demo() {
  return (
    <RadioGroup defaultValue="sm" label="Size" isRequired>
      <Radio value="sm">Small</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  );
}
