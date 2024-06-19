import React from "react";
import { Combobox } from "@/lib/components/core/default/combobox";
import { Item } from "@/lib/components/core/default/list-box";

export default function Demo() {
  return (
    <Combobox label="Tech companies">
      <Item href="https://adobe.com/" target="_blank">
        Adobe
      </Item>
      <Item href="https://apple.com/" target="_blank">
        Apple
      </Item>
      <Item href="https://google.com/" target="_blank">
        Google
      </Item>
      <Item href="https://microsoft.com/" target="_blank">
        Microsoft
      </Item>
    </Combobox>
  );
}
