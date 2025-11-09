import { PinIcon } from "lucide-react";

import { ToggleButton } from "@dotui/registry/ui/toggle-button";

export default function Page() {
  return (
    <ToggleButton aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
