"use client";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import type { Control } from "@dotui/registry/playground";

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
    defaultValue: "Search",
  },
  {
    type: "string",
    name: "placeholder",
    defaultValue: "Search...",
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
];
