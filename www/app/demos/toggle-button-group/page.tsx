import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

export default function Page() {
  return (
    <ToggleButtonGroup orientation="horizontal">
      <ToggleButton aria-label="Align left">
        <AlignLeftIcon />
      </ToggleButton>
      <ToggleButton aria-label="Align center">
        <AlignCenterIcon />
      </ToggleButton>
      <ToggleButton aria-label="Align right">
        <AlignRightIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
