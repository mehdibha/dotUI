"use client";

import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "../index";

interface ComboboxPlaygroundProps {
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export function ComboboxPlayground({
  label = "Country",
  placeholder = "Search countries...",
  ...props
}: ComboboxPlaygroundProps) {
  return (
    <Combobox {...props}>
      {label && <Label>{label}</Label>}
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxItem id="us">United States</ComboboxItem>
        <ComboboxItem id="uk">United Kingdom</ComboboxItem>
        <ComboboxItem id="fr">France</ComboboxItem>
        <ComboboxItem id="de">Germany</ComboboxItem>
        <ComboboxItem id="jp">Japan</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

export const comboboxControls: Control[] = [
  {
    type: "string",
    name: "label",
    defaultValue: "Country",
  },
  {
    type: "string",
    name: "placeholder",
    defaultValue: "Search countries...",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    defaultValue: false,
  },
];
