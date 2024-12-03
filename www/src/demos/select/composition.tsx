import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { Item, ListBox } from "@/components/dynamic-core/list-box";
import { Overlay } from "@/components/dynamic-core/overlay";
import { SelectRoot, SelectValue } from "@/components/dynamic-core/select";
import { ChevronsUpDownIcon } from "@/__icons__";

export default function Demo() {
  return (
    <SelectRoot>
      <Button
        variant="outline"
        suffix={<ChevronsUpDownIcon className="text-fg-muted" />}
      >
        <SelectValue />
      </Button>
      <Overlay type="popover">
        <ListBox>
          <Item>Perplexity</Item>
          <Item>Replicate</Item>
          <Item>Together AI</Item>
          <Item>ElevenLabs</Item>
        </ListBox>
      </Overlay>
    </SelectRoot>
  );
}
