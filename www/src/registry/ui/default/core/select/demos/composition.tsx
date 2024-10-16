import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { Item, ListBox } from "@/registry/ui/default/core/list-box";
import { Overlay } from "@/registry/ui/default/core/overlay";
import { SelectRoot, SelectValue } from "@/registry/ui/default/core/select";
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
