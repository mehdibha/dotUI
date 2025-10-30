"use client";

import React from "react";
import type { Key } from "react-aria-components";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";

export default function Demo() {
  const [country, setCountry] = React.useState<Key | null>("tn");
  return (
    <div className="flex flex-col items-center gap-6">
      <Combobox
        aria-label="country"
        selectedKey={country}
        onSelectionChange={setCountry}
      >
        <ComboboxInput />
        <ComboboxContent>
          <ComboboxItem id="ca">Canada</ComboboxItem>
          <ComboboxItem id="fr">France</ComboboxItem>
          <ComboboxItem id="de">Germany</ComboboxItem>
          <ComboboxItem id="es">Spain</ComboboxItem>
          <ComboboxItem id="tn">Tunisia</ComboboxItem>
          <ComboboxItem id="us">United States</ComboboxItem>
          <ComboboxItem id="uk">United Kingdom</ComboboxItem>
        </ComboboxContent>
      </Combobox>
      <p className="text-sm text-fg-muted">
        {country ? (
          <>
            You selected: <span className="font-bold text-fg">{country}</span>
          </>
        ) : (
          "Select a country."
        )}
      </p>
    </div>
  );
}
