"use client";

import { FieldGroup, Label } from "@dotui/registry/ui/field";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
} from "@dotui/registry/ui/radio-group";

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
