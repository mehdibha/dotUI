import React from "react";
import { Combobox } from "@/components/dynamic-core/combobox";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { Item } from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <Combobox
      label="Country"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you're having trouble, get assisted by our AI."
        />
      }
    >
      <Item>Canada</Item>
      <Item>France</Item>
      <Item>Germany</Item>
      <Item>Spain</Item>
      <Item>Tunisia</Item>
      <Item>United states</Item>
      <Item>United Kingdom</Item>
    </Combobox>
  );
}
