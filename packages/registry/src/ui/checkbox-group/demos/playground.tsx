"use client";

import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { FieldGroup, Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

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
    defaultValue: "Select frameworks",
  },
  {
    type: "enum",
    name: "orientation",
    options: ["horizontal", "vertical"],
    defaultValue: "vertical",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    defaultValue: false,
  },
];
