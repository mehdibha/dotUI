"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";
import { Label } from "@dotui/registry/ui/field";

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
