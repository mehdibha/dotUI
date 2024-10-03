import React from "react";
import { Combobox } from "@/registry/ui/default/core/combobox";
import { Item } from "@/registry/ui/default/core/list-box";

export default function Demo() {
  return (
    <Combobox label="Favorite Animal" isLoading>
      <Item>Red Panda</Item>
      <Item>Cat</Item>
      <Item>Dog</Item>
      <Item>Aardvark</Item>
      <Item>Kangaroo</Item>
      <Item>Snake</Item>
    </Combobox>
  );
}
