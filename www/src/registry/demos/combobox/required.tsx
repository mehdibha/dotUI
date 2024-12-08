import React from "react";
import { Combobox } from "@/components/dynamic-core/combobox";
import { Item } from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <Combobox label="Country" isRequired necessityIndicator="icon">
      <Item>Canada</Item>
      <Item>France</Item>
      <Item>Germany</Item>
      <Item>Spain</Item>
      <Item>Tunisia</Item>
      <Item>United states</Item>
      <Item>United Kingdom</Item>
    </Combobox>
  );
}
