import React from "react";
import { Combobox } from "@/components/dynamic-core/combobox";
import { Item } from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <Combobox aria-label="country" defaultSelectedKey="tn">
      <Item id="ca">Canada</Item>
      <Item id="fr">France</Item>
      <Item id="de">Germany</Item>
      <Item id="es">Spain</Item>
      <Item id="tn">Tunisia</Item>
      <Item id="us">United States</Item>
      <Item id="uk">United Kingdom</Item>
    </Combobox>
  );
}
