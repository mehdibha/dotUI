import React from "react";
import { Combobox, ComboboxItem } from "@/components/dynamic-core/combobox";

export default function Demo() {
  return (
    <Combobox aria-label="country" defaultSelectedKey="tn">
      <ComboboxItem id="ca">Canada</ComboboxItem>
      <ComboboxItem id="fr">France</ComboboxItem>
      <ComboboxItem id="de">Germany</ComboboxItem>
      <ComboboxItem id="es">Spain</ComboboxItem>
      <ComboboxItem id="tn">Tunisia</ComboboxItem>
      <ComboboxItem id="us">United States</ComboboxItem>
      <ComboboxItem id="uk">United Kingdom</ComboboxItem>
    </Combobox>
  );
}
