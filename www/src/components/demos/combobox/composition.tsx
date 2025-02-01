import React from "react";
import {
  ComboboxRoot,
  ComboboxInput,
} from "@/components/dynamic-core/combobox";
import {
  Description,
  FieldError,
  Label,
} from "@/components/dynamic-core/field";
import { Item, ListBox } from "@/components/dynamic-core/list-box";
import { Overlay } from "@/components/dynamic-core/overlay";

export default function Demo() {
  return (
    <ComboboxRoot>
      <Label>Framework</Label>
      <ComboboxInput />
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
