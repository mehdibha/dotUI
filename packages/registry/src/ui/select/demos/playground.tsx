"use client";

import type { Control } from "@dotui/registry/playground";
import { Label } from "@dotui/registry/ui/field";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../index";

interface SelectPlaygroundProps {
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export function SelectPlayground({
  label = "Country",
  placeholder = "Select a country",
  ...props
}: SelectPlaygroundProps) {
  return (
    <Select placeholder={placeholder} {...props}>
      {label && <Label>{label}</Label>}
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="us">United States</SelectItem>
        <SelectItem id="uk">United Kingdom</SelectItem>
        <SelectItem id="fr">France</SelectItem>
        <SelectItem id="de">Germany</SelectItem>
        <SelectItem id="jp">Japan</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const selectControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Country",
  },
  {
    type: "string",
    name: "placeholder",
    label: "Placeholder",
    defaultValue: "Select a country",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    label: "Invalid",
    defaultValue: false,
  },
];

