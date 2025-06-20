import React from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Overlay } from "@dotui/ui/components/overlay";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";

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
