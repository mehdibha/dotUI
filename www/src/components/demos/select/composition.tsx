import React from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { ListBoxItem, ListBox } from "@/components/dynamic-core/list-box";
import { Overlay } from "@/components/dynamic-core/overlay";
import { SelectRoot, SelectValue } from "@/components/dynamic-core/select";

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
          <ListBoxItem>Perplexity</ListBoxItem>
          <ListBoxItem>Replicate</ListBoxItem>
          <ListBoxItem>Together AI</ListBoxItem>
          <ListBoxItem>ElevenLabs</ListBoxItem>
        </ListBox>
      </Overlay>
    </SelectRoot>
  );
}
