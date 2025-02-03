import React from "react";
import { Combobox, ComboboxItem } from "@/components/dynamic-core/combobox";

export default function Demo() {
  return (
    <Combobox
      aria-label="Country"
      isInvalid
      errorMessage="Please select a country in the list."
    >
      <ComboboxItem>Canada</ComboboxItem>
      <ComboboxItem>France</ComboboxItem>
      <ComboboxItem>Germany</ComboboxItem>
      <ComboboxItem>Spain</ComboboxItem>
      <ComboboxItem>Tunisia</ComboboxItem>
      <ComboboxItem>United states</ComboboxItem>
      <ComboboxItem>United Kingdom</ComboboxItem>
    </Combobox>
  );
}
