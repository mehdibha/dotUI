import { PinIcon } from "@dotui/registry/icons";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin" defaultSelected>
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
