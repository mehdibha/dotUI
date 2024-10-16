import React from "react";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";

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
