import React from "react";
import { Radio, RadioGroup } from "@/components/dynamic-ui/radio-group";

export default function Demo() {
  return (
    <RadioGroup defaultValue="sm" label="Size" isRequired>
      <Radio value="sm">Small</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  );
}
