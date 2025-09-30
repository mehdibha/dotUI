import React from "react";

import { ComboboxInput, ComboboxRoot } from "@dotui/registry/ui/combobox";
import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Overlay } from "@dotui/registry/ui/overlay";

export default function Demo() {
  return (
    <ComboboxRoot>
      <Label>Framework</Label>
      <ComboboxInput />
      <Description>Please choose a framework.</Description>
      <FieldError />
      <Overlay type="popover">
        <ListBox>
          <ListBoxItem>Next.js</ListBoxItem>
          <ListBoxItem>Remix</ListBoxItem>
          <ListBoxItem>Gatsby</ListBoxItem>
          <ListBoxItem></ListBoxItem>
        </ListBox>
      </Overlay>
    </ComboboxRoot>
  );
}
