import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { ToggleButton } from "@dotui/registry-v2/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry-v2/ui/toggle-button-group";

export function ToggleButtonGroupDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleButtonGroup>
        <ToggleButton>
          <BoldIcon />
        </ToggleButton>
        <ToggleButton>
          <ItalicIcon />
        </ToggleButton>
        <ToggleButton>
          <UnderlineIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup variant="primary" shape="rectangle">
        <ToggleButton>All</ToggleButton>
        <ToggleButton>Missed</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup variant="primary" shape="rectangle">
        <ToggleButton>last 24 hours</ToggleButton>
        <ToggleButton>last 7 days</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
