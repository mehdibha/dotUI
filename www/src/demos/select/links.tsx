import React from "react";
import { Item } from "@/components/dynamic-core/list-box";
import { Select } from "@/components/dynamic-core/select";

export default function Demo() {
  return (
    <Select label="Project">
      <Item href="/create-project" target="_blank">
        Create new...
      </Item>
      <Item>DotUI</Item>
      <Item>Palettify</Item>
      <Item>Notionfolio</Item>
    </Select>
  );
}
