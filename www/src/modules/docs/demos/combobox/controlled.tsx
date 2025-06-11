"use client";

import type { Key } from "react-aria-components";
import React from "react";
import { Combobox, ComboboxItem } from "@/components/dynamic-ui/combobox";

export default function Demo() {
  const [country, setCountry] = React.useState<Key | null>("tn");
  return (
    <div className="flex flex-col items-center gap-6">
      <Combobox
        aria-label="country"
        selectedKey={country}
        onSelectionChange={setCountry}
      >
        <ComboboxItem id="ca">Canada</ComboboxItem>
        <ComboboxItem id="fr">France</ComboboxItem>
        <ComboboxItem id="de">Germany</ComboboxItem>
        <ComboboxItem id="es">Spain</ComboboxItem>
        <ComboboxItem id="tn">Tunisia</ComboboxItem>
        <ComboboxItem id="us">United States</ComboboxItem>
        <ComboboxItem id="uk">United Kingdom</ComboboxItem>
      </Combobox>
      <p className="text-fg-muted text-sm">
        {country ? (
          <>
            You selected: <span className="text-fg font-bold">{country}</span>
          </>
        ) : (
          "Select a country."
        )}
      </p>
    </div>
  );
}
