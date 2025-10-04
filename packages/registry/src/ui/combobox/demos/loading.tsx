import React from "react";

import { Combobox, ComboboxItem } from "@dotui/registry/ui/combobox";

export default function Demo() {
  return (
    <Combobox label="Favorite Animal" isLoading>
      <ComboboxItem>Red Panda</ComboboxItem>
      <ComboboxItem>Cat</ComboboxItem>
      <ComboboxItem>Dog</ComboboxItem>
      <ComboboxItem>Aardvark</ComboboxItem>
      <ComboboxItem>Kangaroo</ComboboxItem>
      <ComboboxItem>Snake</ComboboxItem>
    </Combobox>
  );
}
