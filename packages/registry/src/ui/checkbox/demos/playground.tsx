"use client";

import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

import { Checkbox, CheckboxIndicator } from "../index";

interface CheckboxPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isIndeterminate?: boolean;
}

export function CheckboxPlayground({
  label = "Accept terms",
  ...props
}: CheckboxPlaygroundProps) {
  return (
    <Checkbox {...props}>
      <CheckboxIndicator />
      <Label>{label}</Label>
    </Checkbox>
  );
}

export const checkboxControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Accept terms",
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
  {
    type: "boolean",
    name: "isIndeterminate",
    label: "Indeterminate",
    defaultValue: false,
  },
];
