import { PinIcon } from "lucide-react";

import { ToggleButton } from "@dotui/ui/components/toggle-button";

export default function Demo() {
  return (
    <ToggleButton isDisabled aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
