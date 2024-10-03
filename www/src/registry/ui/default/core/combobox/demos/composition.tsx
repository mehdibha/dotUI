import React from "react";
import {
  ComboboxRoot,
  ComboboxTrigger,
} from "@/registry/ui/default/core/combobox";
import {
  Description,
  FieldError,
  Label,
} from "@/registry/ui/default/core/field";
import { Item, ListBox } from "@/registry/ui/default/core/list-box";
import { Overlay } from "@/registry/ui/default/core/overlay";

export default function Demo() {
  return (
    <ComboboxRoot>
      <Label>Framework</Label>
      <ComboboxTrigger />
      <Description>Please choose a framework.</Description>
      <FieldError />
      <Overlay type="popover">
        <ListBox>
          <Item>Next.js</Item>
          <Item>Remix</Item>
          <Item>Gatsby</Item>
          <Item></Item>
        </ListBox>
      </Overlay>
    </ComboboxRoot>
  );
}
