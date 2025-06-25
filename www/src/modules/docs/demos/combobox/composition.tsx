import React from "react";

import { ComboboxInput, ComboboxRoot } from "@dotui/ui/components/combobox";
import { Description, FieldError, Label } from "@dotui/ui/components/field";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Overlay } from "@dotui/ui/components/overlay";

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
