"use client";

import React from "react";
import type { Key } from "react-aria-components";
import { Combobox } from "@/registry/ui/default/core/combobox";
import { Item } from "@/registry/ui/default/core/list-box";

export default function Demo() {
  const [country, setCountry] = React.useState<Key | null>("tn");
  return (
    <div className="flex flex-col items-center gap-6">
      <Combobox
        aria-label="country"
        selectedKey={country}
        onSelectionChange={setCountry}
      >
        <Item id="ca">Canada</Item>
        <Item id="fr">France</Item>
        <Item id="de">Germany</Item>
        <Item id="es">Spain</Item>
        <Item id="tn">Tunisia</Item>
        <Item id="us">United States</Item>
        <Item id="uk">United Kingdom</Item>
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
