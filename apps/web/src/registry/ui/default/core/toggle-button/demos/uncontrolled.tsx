import { PinIcon } from "@/lib/icons";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin" defaultSelected>
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
