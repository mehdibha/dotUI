"use client";

import type { Control } from "@dotui/registry/playground";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

import { SearchField } from "../index";

interface SearchFieldPlaygroundProps {
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function SearchFieldPlayground({
  label = "Search",
  placeholder = "Search...",
  ...props
}: SearchFieldPlaygroundProps) {
  return (
    <SearchField {...props}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
    </SearchField>
  );
}

export const searchFieldControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Search",
  },
  {
    type: "string",
    name: "placeholder",
    label: "Placeholder",
    defaultValue: "Search...",
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
];

