import React from "react";
import { ComboboxInput, ComboboxRoot } from "@/components/dynamic-ui/combobox";
import { Description, FieldError, Label } from "@/components/dynamic-ui/field";
import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";
import { Overlay } from "@/components/dynamic-ui/overlay";

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
