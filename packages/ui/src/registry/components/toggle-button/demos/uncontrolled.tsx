import { PinIcon } from "lucide-react";

import { ToggleButton } from "@dotui/ui/components/toggle-button";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin" defaultSelected>
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
