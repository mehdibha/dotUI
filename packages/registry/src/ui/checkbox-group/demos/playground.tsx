"use client";

import type { Control } from "@dotui/registry/playground";
import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { FieldGroup, Label } from "@dotui/registry/ui/field";

import { CheckboxGroup } from "../index";

interface CheckboxGroupPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function CheckboxGroupPlayground({
  label = "Select frameworks",
  ...props
}: CheckboxGroupPlaygroundProps) {
  return (
    <CheckboxGroup defaultValue={["react"]} {...props}>
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <Checkbox value="react">
          <CheckboxIndicator />
          <Label>React</Label>
        </Checkbox>
        <Checkbox value="vue">
          <CheckboxIndicator />
          <Label>Vue</Label>
        </Checkbox>
        <Checkbox value="angular">
          <CheckboxIndicator />
          <Label>Angular</Label>
        </Checkbox>
      </FieldGroup>
    </CheckboxGroup>
  );
}

export const checkboxGroupControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Select frameworks",
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

