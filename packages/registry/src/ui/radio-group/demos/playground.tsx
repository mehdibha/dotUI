"use client";

import type { Control } from "@dotui/registry/playground";
import { FieldGroup, Label } from "@dotui/registry/ui/field";

import { Radio, RadioGroup, RadioIndicator } from "../index";

interface RadioGroupPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function RadioGroupPlayground({
  label = "Select size",
  ...props
}: RadioGroupPlaygroundProps) {
  return (
    <RadioGroup defaultValue="md" {...props}>
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <Radio value="sm">
          <RadioIndicator />
          <Label>Small</Label>
        </Radio>
        <Radio value="md">
          <RadioIndicator />
          <Label>Medium</Label>
        </Radio>
        <Radio value="lg">
          <RadioIndicator />
          <Label>Large</Label>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  );
}

export const radioGroupControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Select size",
  },
  {
    type: "enum",
    name: "orientation",
    label: "Orientation",
    options: ["horizontal", "vertical"],
    defaultValue: "vertical",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    label: "Read Only",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    label: "Invalid",
    defaultValue: false,
  },
];

