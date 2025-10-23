

import { ChevronsUpDownIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Overlay } from "@dotui/registry/ui/overlay";
import { SelectRoot, SelectValue } from "@dotui/registry/ui/select";

export default function Demo() {
  return (
    <SelectRoot aria-label="Provider">
      <Button
        variant="default"
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
