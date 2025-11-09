import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

export default function Page() {
  return (
    <ToggleButtonGroup
      orientation="horizontal"
      selectionMode="single"
      defaultSelectedKeys={["left"]}
    >
      <ToggleButton id="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleButton>
      <ToggleButton id="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleButton>
      <ToggleButton id="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
