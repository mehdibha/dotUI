import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";
import { Overlay } from "@/components/dynamic-ui/overlay";
import { SelectRoot, SelectValue } from "@/components/dynamic-ui/select";
import { ChevronsUpDownIcon } from "lucide-react";

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
